<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Default route to test API functionality
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// Example of another API route
Route::get('/example', function () {
    return response()->json(['data' => 'This is another example route.']);
});

// Example of route that accepts a parameter
Route::get('/user/{id}', function ($id) {
    return response()->json(['userId' => $id]);
});
Route::post('/register', [RegisteredUserController::class, 'store']);

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
