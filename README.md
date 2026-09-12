# DeepVision Jharkhand

### AR-Based Vocational Training Simulator for Industrial Safety

Smart India Hackathon 2026

Problem Statement: SIH26041 
AR-Based Vocational Training Simulator for Industrial Safety in Jharkhand's Mining & Manufacturing Sector

Government of Jharkhand
Department of Higher & Technical Education

---

## About

DeepVision Jharkhand is an AR-based vocational training
and safety certification platform designed for workers
in Jharkhand's mining and manufacturing sector.

## Key Features

- Smartphone-based AR safety training
- Fire & Explosion Response module
- Gas Leak & Confined Space module
- Interactive safety assessment
- Hindi localization
- Offline training support
- QR-based certificates
- Certificate verification
- Admin compliance dashboard

## Technology Stack

### Mobile
React Native + Expo

### AR
Unreal Engine + Google ARCore

### Backend
Node.js + Express

### Database
PostgreSQL / Supabase

### 3D
Blender

### Dashboard
React

### Certificate
PDF + QR verification

---

## Architecture

                 WORKER
                    │
                    ↓
             Android App
                    │
                    ↓
              Unreal Engine
                    │
             ┌──────┴──────┐
             ↓             ↓
           ARCore       Scenario
             │             │
             ↓             ↓
        Camera/AR      Fire/Gas
             │             │
             └──────┬──────┘
                    ↓
              Assessment
                    │
                    ↓
              Local Storage
                    │
             Internet available
                    ↓
                REST API
                    ↓
                Backend
                    ↓
              PostgreSQL
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
    Certificate          Analytics
          │                   │
          ↓                   ↓
         QR              Admin Web
          │
          ↓
     Verification
          │
          ↓
      Blockchain

---

## AR Training Modules

### 1. Fire & Explosion Response

- Fire detection
- Emergency alarm
- Extinguisher selection
- Safe approach
- Fire extinguishing
- Emergency exit
- Evacuation

### 2. Gas Leak & Confined Space

- Hazard identification
- PPE selection
- Buddy-system procedure
- Safe evacuation

---

## Demo

[Watch Demo Video]

[Download APK]

[Live Admin Dashboard]

---

## Team

Team Name: DeepVision 

Smart India Hackathon 2026