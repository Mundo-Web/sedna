<?php

namespace App\Http\Controllers;

use App\Models\LandingHome;
use App\Models\Service;
use App\Models\Solution;
use App\Models\Specialty;
use App\Models\SolutionSubtheme;
use Illuminate\Http\Request;

class SolutionController extends BasicController
{
    public $model = Solution::class;
    public $reactView = 'DetailSolution';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $landing = LandingHome::where('correlative', 'like', 'page_solutions%')->where('lang_id', $langId)->get();
        $solutions = Solution::where('slug', $request->slug)->where('status', true)->where('visible', true)->where('lang_id', $langId)->with('category')->first();
        $allSolutions = Solution::where('status', true)->where('visible', true)->where('lang_id', $langId)->where('category_solution_id', $solutions->category_solution_id)->with('category')->orderBy('updated_at', 'DESC')->get();
        $aliances = Specialty::where('status', true)->where('visible', true)->where('lang_id', $langId)->orderBy('updated_at', 'DESC')->get();
        $allSubsolution = SolutionSubtheme::where('solution_id', $solutions->id)
            ->where('status', true)
            ->where('visible', true)
            ->where('lang_id', $langId)
            ->orderBy('updated_at', 'DESC')
            ->get();
        
        return [
            'landing' => $landing,
            'solutions' => $solutions,
            'allSolutions' => $allSolutions,
            'aliances' => $aliances,
            'allSubsolution' => $allSubsolution,
        ];
    }


    public function getSolutions(Request $request)
    {
        try {
            $langId = app('current_lang_id');
            $query = $request->input('query');
            
            $results = Solution::where('status', true)
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
                'message' => 'Soluciones cargadas con exito'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
