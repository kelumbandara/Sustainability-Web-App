<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'mobile_number' => 'required|string|digits:10', // Add validation for mobile number
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Create the user and store mobile number
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile_number' => $request->mobile_number, // Store the mobile number
            'password' => Hash::make($request->password),
        ]);

        // Fire the Registered event
        event(new Registered($user));

        // Log in the user
        Auth::login($user);

        // Return a response
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ]);
    }
}

