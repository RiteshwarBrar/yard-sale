import React from 'react'
import CompleteSignUpForm from './complete-signup-form';
export default function CompleteSignUpPrompt() {
    return (
        <div className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/50"
        >
            <div className="
                bg-white rounded-xl shadow-lg
                max-w-md w-full mx-4 
                "
            >
            <CompleteSignUpForm />
            </div>
        </div>
    )
}
