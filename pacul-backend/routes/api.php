<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    CarbonController,
    EcoActionController,
    StepController,
    OcrController,
    EnergyController,
    VoucherController,
    WasteReportController,
    CollaborationController,
    MapController,
    GovernmentController,
    NotificationController,
    PushNotificationController,
    SseController,
};

// ── Public ──────────────────────────────────────────────────────────────────
Route::post('/auth/register',      [AuthController::class, 'register']);
Route::post('/auth/login',         [AuthController::class, 'login']);
Route::post('/auth/gov/login',     [AuthController::class, 'govLogin']);

// ── Protected ────────────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post  ('/auth/logout',        [AuthController::class, 'logout']);
    Route::get   ('/auth/me',            [AuthController::class, 'me']);
    Route::put   ('/auth/profile',       [AuthController::class, 'updateProfile']);
    Route::post  ('/auth/avatar',        [AuthController::class, 'uploadAvatar']);
    Route::put   ('/auth/password',      [AuthController::class, 'changePassword']);
    Route::delete('/auth/account',       [AuthController::class, 'deleteAccount']);

    // Carbon Tracker
    Route::get('/carbon/emissions',        [CarbonController::class, 'index']);
    Route::post('/carbon/add',             [CarbonController::class, 'store']);
    Route::get('/carbon/trend/weekly',     [CarbonController::class, 'weeklyTrend']);
    Route::get('/carbon/trend/monthly',    [CarbonController::class, 'monthlyTrend']);
    Route::get('/carbon/breakdown',        [CarbonController::class, 'breakdown']);
    Route::get('/carbon/summary',          [CarbonController::class, 'summary']);

    // OCR
    Route::post('/ocr/scan-bill', [OcrController::class, 'scanBill']);

    // Energy Reports
    Route::get('/energy/reports',                   [EnergyController::class, 'index']);
    Route::post('/energy/monthly-report',           [EnergyController::class, 'store']);
    Route::put('/energy/household-profile',         [EnergyController::class, 'updateProfile']);
    Route::get('/energy/household-profile',         [EnergyController::class, 'getProfile']);
    Route::get('/energy/benchmark',                 [EnergyController::class, 'getBenchmark']);

    // EcoAction
    Route::get ('/eco-action/challenges',                [EcoActionController::class, 'index']);
    Route::post('/eco-action/challenges/{id}/join',      [EcoActionController::class, 'join']);
    Route::post('/eco-action/upload',                    [EcoActionController::class, 'uploadProof']);
    Route::post('/eco-action/challenges/{id}/claim',     [EcoActionController::class, 'claimReward']);
    Route::get ('/eco-action/leaderboard',               [EcoActionController::class, 'leaderboard']);
    Route::get ('/eco-action/my-challenges',             [EcoActionController::class, 'myChallenges']);

    // Step Tracker
    Route::post('/steps/save',    [StepController::class, 'save']);
    Route::get ('/steps/today',   [StepController::class, 'today']);
    Route::get ('/steps/weekly',  [StepController::class, 'weekly']);
    Route::get ('/steps/history', [StepController::class, 'history']);

    // Vouchers
    Route::get ('/vouchers',                     [VoucherController::class, 'index']);
    Route::post('/vouchers/{id}/redeem',         [VoucherController::class, 'redeem']);
    Route::get ('/vouchers/my-vouchers',         [VoucherController::class, 'myVouchers']);
    Route::post('/vouchers/{userVoucherId}/use', [VoucherController::class, 'markUsed']);

    // Waste Reports
    Route::get ('/waste-reports',            [WasteReportController::class, 'index']);
    Route::get ('/waste-reports/map-pins',   [WasteReportController::class, 'mapPins']);
    Route::post('/waste-reports',            [WasteReportController::class, 'store']);
    Route::get ('/waste-reports/{id}',       [WasteReportController::class, 'show']);
    Route::post('/waste-reports/{id}/upvote',[WasteReportController::class, 'upvote']);

    // Collaboration
    Route::get ('/collaboration/posts',          [CollaborationController::class, 'index']);
    Route::post('/collaboration/posts',          [CollaborationController::class, 'store']);
    Route::post('/collaboration/posts/{id}/like',[CollaborationController::class, 'like']);

    // Map
    Route::get ('/map/data',       [MapController::class, 'data']);
    Route::post('/community/join', [MapController::class, 'joinCommunity']);

    // Notifications
    Route::get('/notifications',             [NotificationController::class, 'index']);
    Route::put('/notifications/read-all',    [NotificationController::class, 'readAll']);

    // Push Notifications
    Route::post('/push/subscribe',   [PushNotificationController::class, 'subscribe']);
    Route::delete('/push/unsubscribe',[PushNotificationController::class, 'unsubscribe']);

    // SSE (Server-Sent Events)
    Route::get('/sse/stream', [SseController::class, 'stream']);

    // ── Government (role: government | admin) ───────────────────────────────
    Route::middleware('role:government,admin')->prefix('government')->group(function () {
        Route::get('/reports',           [GovernmentController::class, 'reports']);
        Route::put('/reports/{id}/status',[GovernmentController::class, 'updateStatus']);
        Route::get('/dashboard-stats',   [GovernmentController::class, 'dashboardStats']);
        Route::get('/reports/export',    [GovernmentController::class, 'exportReports']);
    });
});
