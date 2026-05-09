<?php

namespace App\Http\Controllers;

use App\Services\XPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OcrController extends Controller
{
    public function __construct(private XPService $xpService) {}

    public function scanBill(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        $user = $request->user();
        $path = $request->file('image')->store('ocr-scans', 'public');
        $imageUrl = asset('storage/' . $path);

        // If Google Vision is configured, use it
        if (config('services.google.vision_credentials')) {
            try {
                $result = $this->runGoogleVision($path);
                $parsed = $this->parseElectricityBill($result);

                $isFirstScan = ! $user->energyReports()->where('source', 'ocr_scan')->exists();
                if ($isFirstScan) {
                    $this->xpService->award($user, 'first_scan');
                }

                return response()->json([
                    'success'    => true,
                    'image_url'  => $imageUrl,
                    'parsed'     => $parsed,
                    'raw_text'   => $result,
                ]);
            } catch (\Exception $e) {
                Log::error('OCR failed: ' . $e->getMessage());
            }
        }

        // Fallback mock response for development
        return response()->json([
            'success'   => true,
            'image_url' => $imageUrl,
            'parsed'    => [
                'kwh_usage'    => 320,
                'bill_amount'  => 462400,
                'period_month' => (int) now()->format('m'),
                'period_year'  => (int) now()->format('Y'),
            ],
            'raw_text'  => '[OCR mock — configure GOOGLE_VISION_CREDENTIALS for real OCR]',
        ]);
    }

    private function runGoogleVision(string $storagePath): string
    {
        $credentials = config('services.google.vision_credentials');
        $client = new \Google\Cloud\Vision\V1\ImageAnnotatorClient([
            'credentials' => $credentials,
        ]);

        $fullPath = storage_path('app/public/' . $storagePath);
        $image    = file_get_contents($fullPath);
        $response = $client->documentTextDetection($image);
        $client->close();

        return $response->getFullTextAnnotation()?->getText() ?? '';
    }

    private function parseElectricityBill(string $text): array
    {
        $result = ['kwh_usage' => null, 'bill_amount' => null, 'period_month' => null, 'period_year' => null];

        // kWh patterns
        if (preg_match('/(\d[\d,\.]+)\s*(?:kWh|KWH|kwh)/i', $text, $m)) {
            $result['kwh_usage'] = (int) preg_replace('/[,\.]/', '', $m[1]);
        }
        // Bill amount
        if (preg_match('/(?:tagihan|total|rp\.?|idr)\s*[:\s]?\s*([\d,\.]+)/i', $text, $m)) {
            $result['bill_amount'] = (int) preg_replace('/[,\.]/', '', $m[1]);
        }
        // Period
        if (preg_match('/(\d{1,2})\s*\/\s*(\d{4})/', $text, $m)) {
            $result['period_month'] = (int) $m[1];
            $result['period_year']  = (int) $m[2];
        }

        return $result;
    }
}
