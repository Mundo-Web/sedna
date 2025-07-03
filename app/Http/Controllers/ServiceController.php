<?php

namespace App\Http\Controllers;

use App\Models\LandingHome;
use App\Models\Service;
use App\Models\ServiceSubtheme;
use Illuminate\Http\Request;

class ServiceController extends BasicController
{
    public $model = Service::class;
    // public $reactView = 'ServiciosPage';
    public $reactView = 'DetailService';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $landing = LandingHome::where('correlative', 'like', 'page_services%')->where('lang_id', $langId)->get();
        $services = Service::where('slug', $request->slug)->where('status', true)->where('visible', true)->where('lang_id', $langId)->with('category')->first();
        $allServices = Service::where('status', true)->where('visible', true)->where('lang_id', $langId)->where('category_service_id', $services->category_service_id)->with('category')->orderBy('updated_at', 'DESC')->get();
        $allSubServices = ServiceSubtheme::where('service_id', $services->id)
            ->where('status', true)
            ->where('visible', true)
            ->where('lang_id', $langId)
            ->orderBy('updated_at', 'DESC')
            ->get();

        return [
            'landing' => $landing,
            'services' => $services,
            'allServices' => $allServices,
            'allSubServices' => $allSubServices,
        ];
    }


    public function getServices(Request $request)
    {
        try {
            $langId = app('current_lang_id');
            $query = $request->input('query');
            
            $results = Service::where('status', true)
                ->where('visible', true)
                ->where('lang_id', $langId)
                ->where(function($q) use ($query) {
                    $q->where('title', 'like', '%'.$query.'%')
                    ->orWhere('description', 'like', '%'.$query.'%');
                })
                ->get();

            return response()->json([
                'status' => true,
                'data' => $results,
                'message' => 'Solutions retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
