<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use Illuminate\Http\Request;

class MessageController extends BasicController
{
    public $model = Message::class;

    public function beforeSave(Request $request): array
    {   
        // dd($request->all()); // Esto detiene la ejecución, quítalo para producción
        
        $messages = [
            'name.required' => 'El nombre es obligatorio.',
            // Agrega mensajes para los nuevos campos
            'phone.required' => 'El teléfono es obligatorio.',
            'business.string' => 'El nombre de empresa debe ser texto.',
            'date.date' => 'La fecha debe ser válida.'
        ];

        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email|max:320',
            'subject' => 'required|string',
            'description' => 'required|string',
            // 'phone' => 'required|string', // Agregar validación
            'business' => 'nullable|string', // Agregar validación
            'date' => 'nullable|date', // Agregar validación
            'ruc' => 'nullable|string', // Agregar validación
            'interest' => 'nullable|string' // Agregar validación
        ], $messages);

        return $validatedData;
    }

    public function afterSave(Request $request, object $jpa)
    {
        MailingController::notifyContact($jpa);
    }
}
