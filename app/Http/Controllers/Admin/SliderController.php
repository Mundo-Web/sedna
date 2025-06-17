<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Slider;
use App\Http\Requests\StoreSliderRequest;
use App\Http\Requests\UpdateSliderRequest;
use Illuminate\Http\Request;
use App\Http\Classes\dxResponse;
use App\Models\Aboutus;
use App\Models\dxDataGrid;
use App\Models\General;

use App\Models\Social;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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

class SliderController extends BasicController
{
    public $model = Slider::class;
    public $reactView = 'Admin/Sliders';
    public $imageFields = ['image'];
    public $documentFields = ['archive'];

    public function setPaginationInstance(string $model)
    {
        return $model::with(['category']);
    }

    public function setReactViewProperties(Request $request)
    {
        return [];
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $body = $this->beforeSave($request);
            $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));

            // Manejo de documentos
            foreach ($this->documentFields as $field) {
                if (!$request->hasFile($field)) continue;
                $file = $request->file($field);
                
                // Validar tipo de archivo
                $validMimes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'image/svg+xml',
                    'image/jpeg',
                    'image/png'
                ];
                
                if (!in_array($file->getMimeType(), $validMimes)) {
                    throw new \Exception("Tipo de documento no válido");
                }

                // Tamaño máximo 10MB
                if ($file->getSize() > 10 * 1024 * 1024) {
                    throw new \Exception("El documento no puede exceder los 10MB");
                }

                $uuid = Crypto::randomUUID();
                $ext = $file->getClientOriginalExtension();
                $filePath = "documents/{$snake_case}/{$uuid}.{$ext}";

                Storage::put($filePath, file_get_contents($file));
                $body[$field] = "{$uuid}.{$ext}";
                
                // Eliminar documento anterior si existe
                $jpa = $this->model::find($body['id'] ?? null);
                if ($jpa && $jpa->document) {
                    $oldFilePath = "documents/{$snake_case}/{$jpa->document}";
                    if (Storage::exists($oldFilePath)) {
                        Storage::delete($oldFilePath);
                    }
                }
            }

            // Manejo de imágenes (código existente)
            foreach ($this->imageFields as $field) {
                if (!$request->hasFile($field)) continue;
                $full = $request->file($field);
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $body[$field] = "{$uuid}.{$ext}";
            }
            
            // Manejo específico para el video
            if ($request->hasFile('video')) {
                $video = $request->file('video');

                // Validaciones del video
                $validMimes = ['video/mp4', 'video/webm', 'video/ogg'];
                if (!in_array($video->getMimeType(), $validMimes)) {
                    throw new \Exception("Formato de video no válido. Use MP4, WebM u OGG");
                }

                // Tamaño máximo 50MB
                if ($video->getSize() > 50 * 1024 * 1024) {
                    throw new \Exception("El video no puede exceder los 50MB");
                }

                $uuid = Crypto::randomUUID();
                $ext = $video->getClientOriginalExtension();
                $videoPath = "images/{$snake_case}/{$uuid}.{$ext}";

                // Guardar el video en storage
                Storage::put($videoPath, file_get_contents($video));

                // Guardar referencia en la base de datos
                $body['image'] = "{$uuid}.{$ext}"; // Solo guardamos el nombre del archivo
            }

            // Asignar lang_id si el modelo lo tiene y no fue enviado
            $langId = app('current_lang_id');
            $table = (new $this->model)->getTable();
            if (Schema::hasColumn($table, 'lang_id') && !isset($body['lang_id'])) {
                $body['lang_id'] = $langId;
            }

            $jpa = $this->model::find(isset($body['id']) ? $body['id'] : null);

            if (!$jpa) {
                $body['slug'] = Crypto::randomUUID();
                $jpa = $this->model::create($body);
            } else {
                // Eliminar video anterior si existe y se está subiendo uno nuevo
                if ($request->hasFile('video') && $jpa->image) {
                    $oldVideoPath = "images/{$snake_case}/{$jpa->image}";
                    if (Storage::exists($oldVideoPath)) {
                        Storage::delete($oldVideoPath);
                    }
                }
                $jpa->update($body);
            }

            // Manejo de slug (código existente)
            $table = (new $this->model)->getTable();
            if (Schema::hasColumn($table, 'slug')) {
                $slug = Str::slug($jpa->name);
                $slugExists = $this->model::where('slug', $slug)->where('id', '<>', $jpa->id)->exists();
                if ($slugExists) {
                    $slug = $slug . '-' . Crypto::short();
                }
                $jpa->update(['slug' => $slug]);
            }

            $data = $this->afterSave($request, $jpa);
            if ($data) {
                $response->data = $data;
            }

            $response->status = 200;
            $response->message = 'Operación correcta';
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
