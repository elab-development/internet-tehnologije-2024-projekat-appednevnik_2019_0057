<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\ParentModelController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware'=>['auth:sanctum']], function(){
    Route::put('/students/{student}', [StudentController::class, 'update'])->middleware('role:roditelj');
    Route::post('/logout', [AuthController::class, 'logout']);
});

//Route::apiResource('students', StudentController::class)->only(['index','show','update']);
Route::get('students/{student}/grades', [GradeController::class, 'byStudent']);

Route::apiResource('parents', ParentModelController::class)->only(['index', 'show', 'update']);

Route::apiResource('teachers', TeacherController::class)->only(['index','show','update']);

Route::apiResource('subjects', SubjectController::class);

Route::apiResource('grades', GradeController::class)->only(['index', 'show', 'store']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
