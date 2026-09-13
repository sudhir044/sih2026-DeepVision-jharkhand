export type Language = "EN" | "HI" | "SAT";

export const translations = {
    EN: {
        // Common
        common: {
            back: "Back",
            next: "Next",
            continue: "Continue",
            start: "Start",
            submit: "Submit",
            cancel: "Cancel",
            retry: "Retry",
            loading: "Loading...",
            completed: "Completed",
        },

        // Hero
        hero: {
            badge: "INDUSTRIAL SAFETY • AR TRAINING",
            title1: "Learn Safety.",
            title2: "Experience It.",
            description:
                "An immersive AR-based vocational training simulator designed for safer mining and manufacturing workplaces in Jharkhand.",
            getStarted: "GET STARTED",
            existingAccount: "I ALREADY HAVE AN ACCOUNT",
            government: "SIH26041 • GOVERNMENT OF JHARKHAND",
        },

        // Login
        login: {
            title: "Welcome Back",
            subtitle: "Sign in to continue your safety training",
            email: "Email",
            password: "Password",
            emailPlaceholder: "Enter your email",
            passwordPlaceholder: "Enter your password",
            login: "LOGIN",
            loggingIn: "LOGGING IN...",
            missingDetails: "Missing Details",
            enterCredentials:
                "Please enter email and password.",
            loginFailed: "Login Failed",
            dontHaveAccount: "Don't have an account? Sign Up",
        },

        // Signup
        signup: {
            title: "Create Account",
            subtitle: "Register to begin your industrial safety training",
            name: "Full Name",
            namePlaceholder: "Enter your full name",
            email: "Email",
            emailPlaceholder: "Enter your email",
            password: "Password",
            passwordPlaceholder: "Create a password",
            confirmPassword: "Confirm Password",
            confirmPasswordPlaceholder: "Confirm your password",
            signupButton: "CREATE ACCOUNT",
            signingUp: "CREATING ACCOUNT...",
            alreadyHaveAccount: "Already have an account? Sign In",
            missingDetails: "Missing Information",
            enterAllFields: "Please fill in all required fields.",
            passwordsDontMatch: "Passwords do not match.",
            signupFailed: "Registration Failed",
        },

        // Home
        home: {
            greeting: "Welcome",
            trainingProgress: "TRAINING PROGRESS",
            modules: "TRAINING MODULES",
            certificates: "CERTIFICATES",
            noCertificates: "No certificates yet",
            fireTitle: "Fire & Explosion Response",
            fireDescription:
                "Learn how to respond safely to workplace fire emergencies.",
            gasTitle: "Gas Leak & Confined Space",
            gasDescription:
                "Learn gas detection and confined-space safety procedures.",
            startTraining: "START TRAINING",
            viewModule: "VIEW MODULE",
            language: "LANGUAGE",
            quickActions: "QUICK ACCESS",
            learnTrainingBtn: "Training Hub",
            learnTrainingDesc: "AR Fire & Gas safety modules",
            assessmentBtn: "Take Assessment",
            assessmentDesc: "Test safety skills & get certified",
            certificateBtn: "Certificates",
            certificateDesc: "View & verify earned certificates",
        },

        // Fire module
        fire: {
            title: "Fire & Explosion Response",
            subtitle:
                "Learn the correct actions during a workplace fire emergency.",
            duration: "10 MIN",
            difficulty: "BEGINNER",
            briefing: "SAFETY BRIEFING",
            practical: "PRACTICAL TRAINING",
            assessment: "ASSESSMENT",
            certificate: "CERTIFICATE",
            startTraining: "START TRAINING",
            safetyNote: "Safety First",
            safetyDescription:
                "Always follow your workplace emergency procedures and instructions from trained safety personnel.",
        },

        // Gas module
        gas: {
            title: "Gas Leak & Confined Space Protocol",
            subtitle:
                "Learn how to respond safely to gas leaks and confined-space hazards.",
            duration: "10 MIN",
            difficulty: "INTERMEDIATE",
            startTraining: "START TRAINING",
        },

        // Video
        video: {
            title: "Safety Briefing",
            subtitle:
                "Watch the complete safety briefing before starting the AR practical training.",
            step: "STEP 1 OF 4",
            trainingVideo: "Training Video",
            fireResponse: "Fire & Explosion Response",
            watchComplete: "Watch the complete video",
            videoCompleted: "Video completed",
            continueAR: "CONTINUE TO AR TRAINING",
            watchToContinue: "WATCH VIDEO TO CONTINUE",
        },

        // AR Preparation
        arPreparation: {
            title: "AR Training Preparation",
            step: "STEP 2 OF 4",
            instructions: "Before You Start",
            instruction1:
                "Move to a safe and open area.",
            instruction2:
                "Allow camera access when requested.",
            instruction3:
                "Point your phone toward a suitable surface.",
            instruction4:
                "Follow the safety instructions carefully.",
            startAR: "START AR TRAINING",
        },

        // AR Fire
        arFire: {
            title: "Fire Emergency Simulation",
            step: "STEP 3 OF 4",
            fireDetected: "FIRE DETECTED",
            selectExtinguisher:
                "Select the correct extinguisher",
            aimAtFire: "Aim at the base of the fire",
            extinguish: "EXTINGUISH FIRE",
            complete: "COMPLETE TRAINING",
            warning: "SAFETY WARNING",
        },

        // Assessment
        assessment: {
            title: "Knowledge Check",
            heading: "FIRE SAFETY ASSESSMENT",
            question: "Question",
            of: "of",
            next: "NEXT QUESTION",
            submit: "SUBMIT ASSESSMENT",
            complete: "ASSESSMENT COMPLETE",
            passed: "Training Passed",
            failed: "Training Failed",
            eligible:
                "✓ CERTIFICATION ELIGIBLE",
            retraining:
                "⚠ RETRAINING REQUIRED",
            getCertificate: "GET CERTIFICATE",
            retrain: "RETRAIN",
            correct:
                "You answered correctly",
            resultPass:
                "You have successfully completed the Fire & Explosion Response training.",
            resultFail:
                "Please complete the practical training again and retake the assessment.",
        },

        // Certificate
        certificate: {
            title: "Certificate",
            trainingCertificate: "TRAINING CERTIFICATE",
            certified: "CERTIFIED",
            certificateId: "Certificate ID",
            score: "Assessment Score",
            issued: "Issued On",
            verify: "VERIFY CERTIFICATE",
            backHome: "BACK TO DASHBOARD",
            valid: "CERTIFICATE VALID",
        },
    },

    HI: {
        common: {
            back: "वापस",
            next: "अगला",
            continue: "जारी रखें",
            start: "शुरू करें",
            submit: "जमा करें",
            cancel: "रद्द करें",
            retry: "पुनः प्रयास करें",
            loading: "लोड हो रहा है...",
            completed: "पूर्ण",
        },

        hero: {
            badge: "औद्योगिक सुरक्षा • AR प्रशिक्षण",
            title1: "सुरक्षा सीखें।",
            title2: "अनुभव करें।",
            description:
                "झारखंड के खनन और विनिर्माण कार्यस्थलों को सुरक्षित बनाने के लिए AR आधारित व्यावसायिक प्रशिक्षण सिम्युलेटर।",
            getStarted: "शुरू करें",
            existingAccount: "मेरे पास पहले से खाता है",
            government: "SIH26041 • झारखंड सरकार",
        },

        login: {
            title: "वापसी पर स्वागत है",
            subtitle:
                "अपना सुरक्षा प्रशिक्षण जारी रखने के लिए लॉगिन करें",
            email: "ईमेल",
            password: "पासवर्ड",
            emailPlaceholder: "अपना ईमेल दर्ज करें",
            passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
            login: "लॉगिन",
            loggingIn: "लॉगिन हो रहा है...",
            missingDetails: "जानकारी अधूरी है",
            enterCredentials:
                "कृपया ईमेल और पासवर्ड दर्ज करें।",
            loginFailed: "लॉगिन विफल",
            dontHaveAccount: "खाता नहीं है? साइन अप करें",
        },

        // Signup
        signup: {
            title: "खाता बनाएं",
            subtitle: "औद्योगिक सुरक्षा प्रशिक्षण शुरू करने के लिए पंजीकरण करें",
            name: "पूरा नाम",
            namePlaceholder: "अपना पूरा नाम दर्ज करें",
            email: "ईमेल",
            emailPlaceholder: "अपना ईमेल दर्ज करें",
            password: "पासवर्ड",
            passwordPlaceholder: "पासवर्ड बनाएं",
            confirmPassword: "पासवर्ड की पुष्टि करें",
            confirmPasswordPlaceholder: "पासवर्ड दोबारा दर्ज करें",
            signupButton: "खाता बनाएं",
            signingUp: "खाता बनाया जा रहा है...",
            alreadyHaveAccount: "क्या आपके पास पहले से खाता है? लॉगिन करें",
            missingDetails: "जानकारी अधूरी है",
            enterAllFields: "कृपया सभी आवश्यक फ़ील्ड भरें।",
            passwordsDontMatch: "पासवर्ड मेल नहीं खा रहे हैं।",
            signupFailed: "पंजीकरण विफल",
        },

        home: {
            greeting: "स्वागत है",
            trainingProgress: "प्रशिक्षण प्रगति",
            modules: "प्रशिक्षण मॉड्यूल",
            certificates: "प्रमाणपत्र",
            noCertificates: "अभी कोई प्रमाणपत्र नहीं है",
            fireTitle: "आग और विस्फोट प्रतिक्रिया",
            fireDescription:
                "कार्यस्थल पर आग की आपात स्थिति में सुरक्षित प्रतिक्रिया करना सीखें।",
            gasTitle: "गैस रिसाव और सीमित स्थान",
            gasDescription:
                "गैस रिसाव और सीमित स्थान की सुरक्षा प्रक्रियाएं सीखें।",
            startTraining: "प्रशिक्षण शुरू करें",
            viewModule: "मॉड्यूल देखें",
            language: "भाषा",
            quickActions: "त्वरित पहुँच",
            learnTrainingBtn: "प्रशिक्षण हब",
            learnTrainingDesc: "AR अग्नि और गैस सुरक्षा मॉड्यूल",
            assessmentBtn: "मूल्यांकन करें",
            assessmentDesc: "सुरक्षा ज्ञान जांचें और प्रमाणित हों",
            certificateBtn: "प्रमाणपत्र",
            certificateDesc: "अर्जित प्रमाणपत्र देखें और सत्यापित करें",
        },

        fire: {
            title: "आग और विस्फोट प्रतिक्रिया",
            subtitle:
                "कार्यस्थल पर आग की आपात स्थिति के दौरान सही कार्रवाई करना सीखें।",
            duration: "10 मिनट",
            difficulty: "शुरुआती",
            briefing: "सुरक्षा जानकारी",
            practical: "व्यावहारिक प्रशिक्षण",
            assessment: "मूल्यांकन",
            certificate: "प्रमाणपत्र",
            startTraining: "प्रशिक्षण शुरू करें",
            safetyNote: "सुरक्षा पहले",
            safetyDescription:
                "हमेशा अपने कार्यस्थल की आपातकालीन प्रक्रियाओं और प्रशिक्षित सुरक्षा कर्मियों के निर्देशों का पालन करें।",
        },

        gas: {
            title: "गैस रिसाव और सीमित स्थान प्रोटोकॉल",
            subtitle:
                "गैस रिसाव और सीमित स्थान के खतरों से सुरक्षित रूप से निपटना सीखें।",
            duration: "10 मिनट",
            difficulty: "मध्यम",
            startTraining: "प्रशिक्षण शुरू करें",
        },

        video: {
            title: "सुरक्षा जानकारी",
            subtitle:
                "AR व्यावहारिक प्रशिक्षण शुरू करने से पहले पूरा सुरक्षा वीडियो देखें।",
            step: "चरण 1 / 4",
            trainingVideo: "प्रशिक्षण वीडियो",
            fireResponse: "आग और विस्फोट प्रतिक्रिया",
            watchComplete: "पूरा वीडियो देखें",
            videoCompleted: "वीडियो पूरा हो गया",
            continueAR: "AR प्रशिक्षण जारी रखें",
            watchToContinue: "जारी रखने के लिए वीडियो देखें",
        },

        arPreparation: {
            title: "AR प्रशिक्षण की तैयारी",
            step: "चरण 2 / 4",
            instructions: "शुरू करने से पहले",
            instruction1:
                "सुरक्षित और खुले स्थान पर जाएं।",
            instruction2:
                "अनुमति मांगने पर कैमरा एक्सेस दें।",
            instruction3:
                "अपने फोन को उपयुक्त सतह की ओर रखें।",
            instruction4:
                "सुरक्षा निर्देशों का ध्यानपूर्वक पालन करें।",
            startAR: "AR प्रशिक्षण शुरू करें",
        },

        arFire: {
            title: "आग आपातकालीन सिमुलेशन",
            step: "चरण 3 / 4",
            fireDetected: "आग का पता चला",
            selectExtinguisher:
                "सही अग्निशामक चुनें",
            aimAtFire:
                "आग के आधार पर निशाना लगाएं",
            extinguish: "आग बुझाएं",
            complete: "प्रशिक्षण पूरा करें",
            warning: "सुरक्षा चेतावनी",
        },

        assessment: {
            title: "ज्ञान जांच",
            heading: "अग्नि सुरक्षा मूल्यांकन",
            question: "प्रश्न",
            of: "में से",
            next: "अगला प्रश्न",
            submit: "मूल्यांकन जमा करें",
            complete: "मूल्यांकन पूरा",
            passed: "प्रशिक्षण उत्तीर्ण",
            failed: "प्रशिक्षण असफल",
            eligible: "✓ प्रमाणपत्र के लिए योग्य",
            retraining: "⚠ पुनः प्रशिक्षण आवश्यक",
            getCertificate: "प्रमाणपत्र प्राप्त करें",
            retrain: "पुनः प्रशिक्षण",
            correct: "आपने सही उत्तर दिए",
            resultPass:
                "आपने आग और विस्फोट प्रतिक्रिया प्रशिक्षण सफलतापूर्वक पूरा कर लिया है।",
            resultFail:
                "कृपया व्यावहारिक प्रशिक्षण दोबारा पूरा करें और मूल्यांकन फिर से दें।",
        },

        certificate: {
            title: "प्रमाणपत्र",
            trainingCertificate: "प्रशिक्षण प्रमाणपत्र",
            certified: "प्रमाणित",
            certificateId: "प्रमाणपत्र ID",
            score: "मूल्यांकन स्कोर",
            issued: "जारी करने की तारीख",
            verify: "प्रमाणपत्र सत्यापित करें",
            backHome: "डैशबोर्ड पर वापस जाएं",
            valid: "प्रमाणपत्र मान्य है",
        },
    },

    // Santali structure — translations can be expanded later
    SAT: {
        common: {
            back: "Back",
            next: "Next",
            continue: "Continue",
            start: "Start",
            submit: "Submit",
            cancel: "Cancel",
            retry: "Retry",
            loading: "Loading...",
            completed: "Completed",
        },

        hero: {
            badge: "INDUSTRIAL SAFETY • AR TRAINING",
            title1: "Learn Safety.",
            title2: "Experience It.",
            description:
                "AR based vocational safety training simulator for mining and manufacturing.",
            getStarted: "GET STARTED",
            existingAccount: "I ALREADY HAVE AN ACCOUNT",
            government: "SIH26041 • GOVERNMENT OF JHARKHAND",
        },

        login: {
            title: "Welcome Back",
            subtitle: "Sign in to continue your safety training",
            email: "Email",
            password: "Password",
            emailPlaceholder: "Enter your email",
            passwordPlaceholder: "Enter your password",
            login: "LOGIN",
            loggingIn: "LOGGING IN...",
            missingDetails: "Missing Details",
            enterCredentials:
                "Please enter email and password.",
            loginFailed: "Login Failed",
            dontHaveAccount: "Don't have an account? Sign Up",
        },

        // Signup
        signup: {
            title: "Create Account",
            subtitle: "Register to begin your industrial safety training",
            name: "Full Name",
            namePlaceholder: "Enter your full name",
            email: "Email",
            emailPlaceholder: "Enter your email",
            password: "Password",
            passwordPlaceholder: "Create a password",
            confirmPassword: "Confirm Password",
            confirmPasswordPlaceholder: "Confirm your password",
            signupButton: "CREATE ACCOUNT",
            signingUp: "CREATING ACCOUNT...",
            alreadyHaveAccount: "Already have an account? Sign In",
            missingDetails: "Missing Information",
            enterAllFields: "Please fill in all required fields.",
            passwordsDontMatch: "Passwords do not match.",
            signupFailed: "Registration Failed",
        },

        home: {
            greeting: "Welcome",
            trainingProgress: "TRAINING PROGRESS",
            modules: "TRAINING MODULES",
            certificates: "CERTIFICATES",
            noCertificates: "No certificates yet",
            fireTitle: "Fire & Explosion Response",
            fireDescription:
                "Learn safe response procedures for workplace fire emergencies.",
            gasTitle: "Gas Leak & Confined Space",
            gasDescription:
                "Learn gas leak and confined-space safety procedures.",
            startTraining: "START TRAINING",
            viewModule: "VIEW MODULE",
            language: "LANGUAGE",
            quickActions: "QUICK ACCESS",
            learnTrainingBtn: "Training Hub",
            learnTrainingDesc: "AR Fire & Gas safety modules",
            assessmentBtn: "Take Assessment",
            assessmentDesc: "Test safety skills & get certified",
            certificateBtn: "Certificates",
            certificateDesc: "View & verify earned certificates",
        },

        fire: {
            title: "Fire & Explosion Response",
            subtitle:
                "Learn correct actions during a workplace fire emergency.",
            duration: "10 MIN",
            difficulty: "BEGINNER",
            briefing: "SAFETY BRIEFING",
            practical: "PRACTICAL TRAINING",
            assessment: "ASSESSMENT",
            certificate: "CERTIFICATE",
            startTraining: "START TRAINING",
            safetyNote: "Safety First",
            safetyDescription:
                "Follow workplace emergency procedures and trained safety personnel instructions.",
        },

        gas: {
            title: "Gas Leak & Confined Space Protocol",
            subtitle:
                "Learn safe procedures for gas leaks and confined spaces.",
            duration: "10 MIN",
            difficulty: "INTERMEDIATE",
            startTraining: "START TRAINING",
        },

        video: {
            title: "Safety Briefing",
            subtitle:
                "Watch the complete safety briefing before AR practical training.",
            step: "STEP 1 OF 4",
            trainingVideo: "Training Video",
            fireResponse: "Fire & Explosion Response",
            watchComplete: "Watch the complete video",
            videoCompleted: "Video completed",
            continueAR: "CONTINUE TO AR TRAINING",
            watchToContinue: "WATCH VIDEO TO CONTINUE",
        },

        arPreparation: {
            title: "AR Training Preparation",
            step: "STEP 2 OF 4",
            instructions: "Before You Start",
            instruction1: "Move to a safe and open area.",
            instruction2: "Allow camera access when requested.",
            instruction3: "Point your phone toward a suitable surface.",
            instruction4: "Follow the safety instructions carefully.",
            startAR: "START AR TRAINING",
        },

        arFire: {
            title: "Fire Emergency Simulation",
            step: "STEP 3 OF 4",
            fireDetected: "FIRE DETECTED",
            selectExtinguisher:
                "Select the correct extinguisher",
            aimAtFire: "Aim at the base of the fire",
            extinguish: "EXTINGUISH FIRE",
            complete: "COMPLETE TRAINING",
            warning: "SAFETY WARNING",
        },

        assessment: {
            title: "Knowledge Check",
            heading: "FIRE SAFETY ASSESSMENT",
            question: "Question",
            of: "of",
            next: "NEXT QUESTION",
            submit: "SUBMIT ASSESSMENT",
            complete: "ASSESSMENT COMPLETE",
            passed: "Training Passed",
            failed: "Training Failed",
            eligible: "✓ CERTIFICATION ELIGIBLE",
            retraining: "⚠ RETRAINING REQUIRED",
            getCertificate: "GET CERTIFICATE",
            retrain: "RETRAIN",
            correct: "You answered correctly",
            resultPass:
                "You have successfully completed the Fire & Explosion Response training.",
            resultFail:
                "Please complete the practical training again and retake the assessment.",
        },

        certificate: {
            title: "Certificate",
            trainingCertificate: "TRAINING CERTIFICATE",
            certified: "CERTIFIED",
            certificateId: "Certificate ID",
            score: "Assessment Score",
            issued: "Issued On",
            verify: "VERIFY CERTIFICATE",
            backHome: "BACK TO DASHBOARD",
            valid: "CERTIFICATE VALID",
        },
    },
} as const;