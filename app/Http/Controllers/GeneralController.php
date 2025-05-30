<?php

namespace App\Http\Controllers;


use App\Http\Classes\dxResponse;
use App\Models\Aboutus;
use App\Models\dxDataGrid;
use App\Models\Facility;
use App\Models\General;
use App\Models\Indicator;
use App\Models\Lang;
use App\Models\Slider;
use App\Models\Social;
use App\Models\Solution;
use App\Models\Service;
use App\Models\PurchaseOption;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use SoDe\Extend\Crypto;
use SoDe\Extend\Response;
use SoDe\Extend\Text;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;


class GeneralController extends BasicController
{


    public function getSocials(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $data = Social::all();
            // dump($data);
            $response->data = $data;
            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {

            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }

    public function getLanguages(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $data = Lang::where('status', true)->where('visible', true)->get();
            // dump($data);
            $response->data = $data;
            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {

            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }

    public function getBenefits(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $data = Indicator::all();

            $response->data = $data;
            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {

            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }


    public function getAboutuses(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $data = Aboutus::all();
            $data2 = General::where('lang_id', app('current_lang_id'))->get();
            $data3 = Facility::where('visible', true)->where('status', true)->where('lang_id', app('current_lang_id'))->get();
            // dump($data);
            $response->data = ['aboutus' => $data, 'generals' => $data2, 'sedes' => $data3];
            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {

            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }

    public function getMegamenu(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
           
            $solutions = Solution::where('status', true)->where('lang_id', app('current_lang_id'))->with('category')->get();
            $service = Service::where('status', true)->where('lang_id', app('current_lang_id'))->with('category')->get();
            $options = PurchaseOption::where('status', true)->where('lang_id', app('current_lang_id'))->with('category')->get();

            $response->data = ['solutions' => $solutions, 'services' => $service, 'options' => $options];
            $response->status = 200;
            $response->message = 'Operacion correcta';

        } catch (\Throwable $th) {

            $response->status = 400;
            $response->message = $th->getMessage();

        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }
}
