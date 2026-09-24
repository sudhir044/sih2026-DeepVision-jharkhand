package com.anonymous.safearjharkhand

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class UnityBridgeModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    companion object {
        const val REQUEST_CODE_UNITY_AR = 9001
        private const val EVENT_COMPLETED = "UnityARCompleted"
        private const val EVENT_CLOSED = "UnityARClosed"
        private const val TAG = "UnityBridgeModule"
    }

    private var pendingPromise: Promise? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = "UnityBridge"

    @ReactMethod
    fun isUnityAvailable(promise: Promise) {
        try {
            Class.forName("com.unity3d.player.UnityPlayerGameActivity")
            promise.resolve(true)
        } catch (e: ClassNotFoundException) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun launchAR(promise: Promise) {
        val activity = reactApplicationContext.currentActivity
        try {
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "Current activity is null")
                return
            }

            pendingPromise = promise

            val intent = Intent(activity, com.unity3d.player.UnityPlayerGameActivity::class.java)
            activity.startActivityForResult(intent, REQUEST_CODE_UNITY_AR)
            Log.i(TAG, "startActivityForResult called with requestCode $REQUEST_CODE_UNITY_AR")

        } catch (e: Throwable) {
            pendingPromise = null
            Log.e(TAG, "Failed to launch Unity AR", e)
            promise.reject("LAUNCH_FAILED", "Failed to launch Unity AR: ${e.message}", e)
        }
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        Log.i(TAG, "onActivityResult: requestCode=$requestCode, resultCode=$resultCode")
        if (requestCode == REQUEST_CODE_UNITY_AR) {
            val completed = (resultCode == Activity.RESULT_OK) || (data?.getBooleanExtra("completed", false) == true)
            Log.i(TAG, "Unity AR returned. completed = $completed")

            val params = Arguments.createMap().apply {
                putBoolean("completed", completed)
                putInt("resultCode", resultCode)
            }

            if (completed) {
                Log.i(TAG, "Emitting event $EVENT_COMPLETED")
                sendEvent(EVENT_COMPLETED, params)
            } else {
                Log.i(TAG, "Emitting event $EVENT_CLOSED")
                sendEvent(EVENT_CLOSED, params)
            }

            pendingPromise?.let {
                val result = Arguments.createMap().apply {
                    putBoolean("success", true)
                    putBoolean("completed", completed)
                }
                it.resolve(result)
                pendingPromise = null
            }
        }
    }

    override fun onNewIntent(intent: Intent) {}

    private fun sendEvent(eventName: String, params: WritableMap) {
        try {
            if (reactContext.hasActiveReactInstance()) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(eventName, params)
            }
        } catch (t: Throwable) {
            Log.e(TAG, "Failed to send event $eventName", t)
        }
    }
}
