<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Aboutus;
use App\Models\Ad;
use App\Models\Indicator;
use App\Models\InstagramPost;
use App\Models\Item;
use App\Models\LandingHome;
use App\Models\Lang;
use App\Models\Post;
use App\Models\Service;
use App\Models\Solution;
use App\Models\PurchaseOption;
use App\Models\Slider;
use App\Models\Staff;
use App\Models\Strength;
use App\Models\Supply;
use App\Models\Testimony;

class HeaderController extends BasicController
{
    public $reactView = 'Header';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {

        $langId = app('current_lang_id');

        /*ESTO ES PARA NO PAIN */

        $indicators = Indicator::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $landing = LandingHome::where('correlative', 'like', 'page_home%')->where('lang_id', $langId)->get();
        $benefits = Strength::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $testimonies = Testimony::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $staff_boss = Staff::where('status', true)->where('visible', true)->where('job', 'LIKE', 'Director%')->where('lang_id', $langId)->first();
        
        $options = PurchaseOption::where('status', true)->where('visible', true)->where('featured', true)->where('lang_id', $langId)->with('category')->orderBy('created_at', 'DESC')->limit(20)->get();
        $services = Service::where('status', true)->where('visible', true)->where('featured', true)->where('lang_id', $langId)->with('category')->orderBy('created_at', 'DESC')->limit(20)->get();
        $solutions = Solution::where('status', true)->where('visible', true)->where('lang_id', $langId)->with('category')->orderBy('created_at', 'DESC')->limit(28)->get();

        $totalSolutions = $solutions->count();

        return [

            'indicators' => $indicators,
            'landing' => $landing,
            'benefits' => $benefits,
            'services' => $services,
            'testimonies' => $testimonies,
            'staff_boss' => $staff_boss,
            'options' => $options,
            'solutions' => $solutions,
            
        ];
    }
}
