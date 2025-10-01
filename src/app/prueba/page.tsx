"use client"; // Esto es necesario para usar hooks como useState, useEffect

import { useRef, useEffect, useState } from "react";

export default function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamStarted, setStreamStarted] = useState(false);
    const url = process.env.NEXT_PUBLIC_API_URL + "/usuario/facial/";

  // Configuración del backend

  // Inicializar cámara
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStreamStarted(true);
        }
      } catch (err) {
        console.error("Error accediendo a la cámara:", err);
      }
    };

    startCamera();
  }, []);

  // Capturar imagen y enviar al backend cada 5 segundos
  useEffect(() => {
    if (!streamStarted) return;

    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("image", blob, "capture.jpg");

        try {
          const response = await fetch(url, {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          console.log("Respuesta del backend:", data);
        } catch (err) {
          console.error("Error enviando la imagen:", err);
        }
      }, "image/jpeg");
    }, 2500); // cada 5 segundos

    return () => clearInterval(interval);
  }, [streamStarted]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-4">Prueba de Cámara</h1>
      <video ref={videoRef} className="border rounded" />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
