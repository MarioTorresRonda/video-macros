import PrettyButton from "@/components/Commons/PrettyButton";
import React, { useState, useEffect, useRef } from "react";

const orientation = {
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

const simpleTextLocation = {
    topLeft: { x : "30", y: "30" },
    topRight: { x : "-30", y: "30" },
    bottomLeft: { x : "30", y: "-30" },
    bottomRight: { x : "-30", y: "-30" },
    middle: { x : "/2", y: "/2" },
}

function TransformCanvas( canvas, location )  {
    const x = TransformOperation( canvas.width, location.x );
    const y = TransformOperation( canvas.height, location.y );
    return {x, y}
}

function TransformOperation( canvasValue, value ) {
    if ( value.startsWith("-") ) {
        return canvasValue - Number(value.substr(1));
    }
    if ( value.startsWith("/") ) {
        return canvasValue / Number(value.substr(1));
    }
    return Number(value);
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

export default function ThumbnailGenerator( { canvasRef, bg, text1, text2, text3, text4 } ) {
  // 1. Manage input states
  const [bgImageUrl, setBgImageUrl] = useState(bg);
  
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textSize, setTextSize] = useState(150);

  // 3. Redraw the image every time any state dependency changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // 1. Create a new HTML Image instance
    const img = new Image();
    
    // Fix cross-origin security issues if loading images from external domains
    img.crossOrigin = "anonymous"; 
    img.src = bgImageUrl;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      text1 && fillText( ctx, textSize, textColor, text1, TransformCanvas( canvas, simpleTextLocation.topLeft ), orientation.leftTop )
      text2 && fillText( ctx, textSize, textColor, text2, TransformCanvas( canvas, simpleTextLocation.topRight ), orientation.rightTop )
      text3 && fillText( ctx, textSize, textColor, text3, TransformCanvas( canvas, simpleTextLocation.bottomLeft ), orientation.leftBottom )
      text4 && fillText( ctx, textSize, textColor, text4, TransformCanvas( canvas, simpleTextLocation.bottomRight ), orientation.rightBottom )
    };

    img.onerror = () => {
      ctx.fillStyle = "#333333";
      ctx.fillRect(0, 0, canvas.width, canvas.height);      
      fillText( ctx, textSize, "#ff4444", "Failed to load background image.", TransformCanvas( canvas, simpleTextLocation.topLeft ), orientation.left )
    };

  }, [ bgImageUrl, textColor, textSize, text1, text2, text3, text4 ]); // Triggers redraw automatically on change

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