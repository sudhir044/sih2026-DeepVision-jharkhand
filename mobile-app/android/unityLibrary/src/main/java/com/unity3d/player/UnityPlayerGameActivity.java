package com.unity3d.player;

import android.annotation.TargetApi;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.SurfaceView;
import android.widget.FrameLayout;

import androidx.core.view.ViewCompat;

import com.google.androidgamesdk.GameActivity;

public class UnityPlayerGameActivity extends GameActivity implements IUnityPlayerLifecycleEvents, IUnityPermissionRequestSupport, IUnityPlayerSupport
{
    private static final String TAG = "UnityPlayerGameActivity";

    class GameActivitySurfaceView extends InputEnabledSurfaceView
    {
        GameActivity mGameActivity;
        public GameActivitySurfaceView(GameActivity activity) {
            super(activity);
            mGameActivity = activity;
        }

        // Reroute motion events from captured pointer to normal events
        // Otherwise when doing Cursor.lockState = CursorLockMode.Locked from C# the touch and mouse events will stop working
        @Override public boolean onCapturedPointerEvent(MotionEvent event) {
            return mGameActivity.onTouchEvent(event);
        }
    }

    protected UnityPlayerForGameActivity mUnityPlayer;

    protected String updateUnityCommandLineArguments(String cmdLine)
    {
        return cmdLine;
    }

    private static native void UnityInitializeFromUIThead();

    static
    {
        Log.i(TAG, "Static init: loading libmain.so and libgame.so");
        try {
            System.loadLibrary("main");
            Log.i(TAG, "Successfully loaded libmain.so");
        } catch (Throwable t) {
            Log.e(TAG, "Error loading libmain.so", t);
        }
        try {
            System.loadLibrary("game");
            Log.i(TAG, "Successfully loaded libgame.so");
        } catch (Throwable t) {
            Log.e(TAG, "Error loading libgame.so", t);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState){
        Log.i("UNITY_INIT_DEBUG", "[Java] UnityPlayerGameActivity.onCreate START");
        Log.i("UNITY_INIT_DEBUG", "[Java] before UnityInitializeFromUIThead()");
        try {
            UnityInitializeFromUIThead();
            Log.i("UNITY_INIT_DEBUG", "[Java] after UnityInitializeFromUIThead()");
        } catch (Throwable t) {
            Log.w("UNITY_INIT_DEBUG", "[Java] UnityInitializeFromUIThead() failed or not bound", t);
        }
        Log.i("UNITY_INIT_DEBUG", "[Java] before super.onCreate()");
        super.onCreate(savedInstanceState);
        Log.i("UNITY_INIT_DEBUG", "[Java] after super.onCreate()");

        getOnBackPressedDispatcher().addCallback(this, new androidx.activity.OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                Log.i("UNITY_INIT_DEBUG", "[Java] Back invoked via OnBackPressedDispatcher");
                onBackRequested();
            }
        });

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                () -> {
                    Log.i("UNITY_INIT_DEBUG", "[Java] Back invoked via OnBackInvokedCallback");
                    onBackRequested();
                }
            );
        }
    }

    @Override
    public UnityPlayerForGameActivity getUnityPlayerConnection() {
        return mUnityPlayer;
    }

    // Soft keyboard relies on inset listener for listening to various events - keyboard opened/closed/text entered.
    private void applyInsetListener(SurfaceView surfaceView)
    {
        surfaceView.getViewTreeObserver().addOnGlobalLayoutListener(
                () -> onApplyWindowInsets(surfaceView, ViewCompat.getRootWindowInsets(getWindow().getDecorView())));
    }

    @Override protected InputEnabledSurfaceView createSurfaceView() {
        Log.i("UNITY_INIT_DEBUG", "[Java] createSurfaceView()");
        return new GameActivitySurfaceView(this);
    }

    @Override protected void onCreateSurfaceView() {
        Log.i("UNITY_INIT_DEBUG", "[Java] onCreateSurfaceView() START");
        super.onCreateSurfaceView();
        FrameLayout frameLayout = findViewById(contentViewId);

        // The workaround is not needed for Android 11 or above starting with GameActivity 4.3.0-alpha01
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.Q)
            applyInsetListener(mSurfaceView);

        mSurfaceView.setId(UnityPlayerForGameActivity.getUnityViewIdentifier(this));

        String cmdLine = updateUnityCommandLineArguments(getIntent().getStringExtra("unity"));
        getIntent().putExtra("unity", cmdLine);
        // Unity requires access to frame layout for setting the static splash screen.
        // Note: we cannot initialize in onCreate (after super.onCreate), because game activity native thread would be already started and unity runtime initialized
        //       we also cannot initialize before super.onCreate since frameLayout is not yet available.
        Log.i("UNITY_INIT_DEBUG", "[Java] before UnityPlayerForGameActivity constructor");
        mUnityPlayer = new UnityPlayerForGameActivity(this, frameLayout, mSurfaceView, this);
        UnityPlayer.currentActivity = this;
        UnityPlayer.currentContext = this;
        Log.i("UNITY_INIT_DEBUG", "[Java] after UnityPlayerForGameActivity constructor");
        Log.i("UNITY_INIT_DEBUG", "[Java] onCreateSurfaceView() END");
    }

    @Override
    public void onUnityPlayerUnloaded() {
        Log.i(TAG, "onUnityPlayerUnloaded()");
        finish();
    }

    @Override
    public void onUnityPlayerQuitted() {
        Log.i(TAG, "onUnityPlayerQuitted()");
        finish();
    }

    // Quit Unity
    @Override protected void onDestroy ()
    {
        Log.i(TAG, "onDestroy()");
        if (mUnityPlayer != null) {
            mUnityPlayer.destroy();
        }
        super.onDestroy();
    }

    @Override protected void onStop()
    {
        Log.i(TAG, "onStop()");
        if (mUnityPlayer != null) {
            mUnityPlayer.onStop();
        }
        super.onStop();
    }

    @Override protected void onStart()
    {
        Log.i(TAG, "onStart()");
        if (mUnityPlayer != null) {
            mUnityPlayer.onStart();
        }
        super.onStart();
    }

    // Pause Unity
    @Override protected void onPause()
    {
        Log.i(TAG, "onPause()");
        if (mUnityPlayer != null) {
            mUnityPlayer.onPause();
        }
        super.onPause();
    }

    // Resume Unity
    @Override protected void onResume()
    {
        Log.i(TAG, "onResume()");
        if (mUnityPlayer != null) {
            mUnityPlayer.onResume();
        }
        super.onResume();
    }

    // Configuration changes are used by Video playback logic in Unity
    @Override public void onConfigurationChanged(Configuration newConfig)
    {
        Log.i(TAG, "onConfigurationChanged()");
        if (mUnityPlayer != null) {
            mUnityPlayer.configurationChanged(newConfig);
        }
        super.onConfigurationChanged(newConfig);
    }

    // Notify Unity of the focus change.
    @Override public void onWindowFocusChanged(boolean hasFocus)
    {
        Log.i(TAG, "onWindowFocusChanged(" + hasFocus + ")");
        if (mUnityPlayer != null) {
            mUnityPlayer.windowFocusChanged(hasFocus);
        }
        super.onWindowFocusChanged(hasFocus);
    }

    @Override protected void onNewIntent(Intent intent)
    {
        super.onNewIntent(intent);
        setIntent(intent);
        if (mUnityPlayer != null) {
            mUnityPlayer.newIntent(intent);
        }
    }

    @Override
    @TargetApi(Build.VERSION_CODES.M)
    public void requestPermissions(PermissionRequest request)
    {
        if (mUnityPlayer != null) {
            mUnityPlayer.addPermissionRequest(request);
        }
    }

    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
    {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (mUnityPlayer != null) {
            mUnityPlayer.permissionResponse(this, requestCode, permissions, grantResults);
        }
    }

    public void onTaskCompleted() {
        Log.i("UNITY_INIT_DEBUG", "[Java] onTaskCompleted() called! Setting RESULT_OK (completed=true)");
        runOnUiThread(() -> {
            Intent resultIntent = new Intent();
            resultIntent.putExtra("completed", true);
            setResult(RESULT_OK, resultIntent);
            finish();
        });
    }

    public void onBackRequested() {
        Log.i("UNITY_INIT_DEBUG", "[Java] onBackRequested() called! Setting RESULT_CANCELED (completed=false)");
        runOnUiThread(() -> {
            Intent resultIntent = new Intent();
            resultIntent.putExtra("completed", false);
            setResult(RESULT_CANCELED, resultIntent);
            finish();
        });
    }

    public static void finishWithResult(boolean completed) {
        if (UnityPlayer.currentActivity instanceof UnityPlayerGameActivity) {
            UnityPlayerGameActivity activity = (UnityPlayerGameActivity) UnityPlayer.currentActivity;
            if (completed) {
                activity.onTaskCompleted();
            } else {
                activity.onBackRequested();
            }
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, android.view.KeyEvent event) {
        if (keyCode == android.view.KeyEvent.KEYCODE_BACK) {
            Log.i("UNITY_INIT_DEBUG", "[Java] KEYCODE_BACK intercepted in onKeyDown");
            onBackRequested();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        Log.i("UNITY_INIT_DEBUG", "[Java] onBackPressed() called");
        onBackRequested();
    }
}

