'use client'

import PrettyButton from "@/components/Commons/PrettyButton";
import React, { useState, useEffect, useRef } from "react";

export default function ThumbnailGenerator( { canvasRef, formatThumbnailObj } ) {
  // 1. Manage input states
  const bg = formatThumbnailObj.bg;
  const texts = formatThumbnailObj.texts;
  
  const [bgImageUrl, setBgImageUrl] = useState(bg);
  const [textColor, setTextColor] = useState("#FFFFFF");

  // 3. Redraw the image every time any state dependency changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    async function loadCanvas() {
      try{
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const bgImg = await loadImage(bgImageUrl)
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        
        for (let index = 0; index < texts.length; index++) {
          const freeText = texts[index];
          if ( freeText.value ) {
            fillText( ctx, freeText.size, textColor, freeText.value, freeText.location, freeText.location.orientation )
          }else{
            const img = await loadImage(freeText.image)
            ctx.drawImage(img, freeText.location.x, freeText.location.y, freeText.size.x, freeText.size.y );
          }
        };      
      }catch(e) {
        ctx.fillStyle = "#333333";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        fillText( ctx, 50, "#ff4444", "Failed to load: " + e.message, { x : 1920/2, y: 1080/2 }, canvasTextOrientation.centerMiddle )
      }
    }
    
    loadCanvas();
  }, [bgImageUrl, textColor, canvasRef, texts ]); // Triggers redraw automatically on change
    
  return (
    <div className="flex gap-2 p-2 w-90 h-50.5">
      <div className="flex flex-col items-center">
        <canvas 
          ref={canvasRef} 
          width={1920} 
          height={1080} 
          className="w-full h-full"
          style={{ border: "1px solid #ddd", borderRadius: "8px", maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}

export const canvasTextOrientation = {
    leftTop:  { textAlign: "left", textBaseline : "top" },
    leftMiddle: { textAlign: "left", textBaseline : "middle" },
    leftBottom: { textAlign: "left", textBaseline : "bottom" },
    centerTop: { textAlign: "center", textBaseline : "Top" },
    centerMiddle: { textAlign: "center", textBaseline : "middle" },
    centerBottom: { textAlign: "center", textBaseline : "bottom" },
    rightTop: { textAlign: "right", textBaseline : "bottom" },
    rightMiddle: { textAlign: "right", textBaseline : "middle" },
    rightBottom: { textAlign: "right", textBaseline : "bottom" },
}

function fillText( ctx, size, color, text, vector2, orientation )  {
    ctx.font = `${size}px Sans-serif`;
    ctx.strokeStyle = 'black';
    ctx.textAlign = orientation.textAlign;
    ctx.textBaseline  = orientation.textBaseline;
    ctx.lineWidth = size / 7;
    ctx.strokeText(text, vector2.x, vector2.y);
    ctx.fillStyle = color;
    ctx.fillText(text, vector2.x, vector2.y);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = reject;

    img.src = src;
  });
}