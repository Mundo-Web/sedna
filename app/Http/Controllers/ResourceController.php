<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LandingHome;
use App\Models\Slider;
use App\Models\Category;

class ResourceController extends BasicController
{
    public $reactView = 'Resources';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $landing = LandingHome::where('correlative', 'like', 'page_resources%')->where('lang_id', $langId)->get();
        $resourceJPA = Slider::select()->where('visible', true)->where('status', true)->where('lang_id', $langId)->orderBy('updated_at', 'DESC')->get();
        $categories = Category::select([
            DB::raw('DISTINCT(categories.id)'),
            'categories.name'
        ])
            ->join('sliders', 'sliders.category_id', 'categories.id')
            ->where('categories.visible', true)
            ->where('sliders.lang_id', $langId)
            ->where('categories.status', true)
            ->get();

        return [
            'resources' => $resourceJPA,
            'landing' => $landing,
            'categories' => $categories,

        ];
    }
}
