import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { icons, profilePath } from "utils/constants";
import { generatePreSignedUrl, titleCaseString } from "utils/helpers";

const SpeakerPoster = ({ data, onChange, isVisible }) => {
  const {
    name,
    profile_photo_path,
    designation,
    institution_name,
    event_name,
    instituteName,
  } = data || {};
  let newEvent = event_name;
  if (newEvent?.length >= 120) {
    newEvent = `${newEvent?.substring(0, 120)}...`;
  }
  const fabricRef = useRef(null);
  const canvasRef = useRef(null);
  const addBackground = () => {
    const bgImage = icons.welcomeBoardImage;
    fabric?.Image?.fromURL(
      bgImage,
      (img) => {
        img?.scaleToWidth(352);
        img?.set({ selectable: false, evented: false });
        fabricRef?.current?.setBackgroundImage(
          img,
          fabricRef?.current?.renderAll?.bind(fabricRef?.current)
        );
      },
      { crossOrigin: "anonymous" }
    );
  };

  const addFooterContent = () => {
    const webIconUrl = icons?.lightWebsite;
    fabric?.Image?.fromURL(
      webIconUrl,
      (img) => {
        img?.scaleToWidth(16);
        const text = new fabric.Textbox("https://www.iferp.in", {
          left: 20,
          top: 0,
          fill: "#ffffff",
          fontSize: 12,
          fontFamily: "Inter",
          fontWeight: 400,
        });
        const group = new fabric.Group([img, text], {
          left: 10,
          top: fabricRef?.current?.height - 19,
          selectable: false,
        });
        fabricRef?.current?.add(group);
        fabricRef?.current?.renderAll();
      },
      { crossOrigin: "anonymous" }
    );
    const emailIconUrl = icons.lightEmail;
    fabric.Image.fromURL(
      emailIconUrl,
      (img) => {
        img?.scaleToWidth(16);
        const text = new fabric.Textbox("info@iferp.in", {
          left: 20,
          top: 0,
          fill: "#ffffff",
          fontSize: 12,
          fontFamily: "Inter",
          fontWeight: 400,
        });
        const group = new fabric.Group([img, text], {
          left: fabricRef?.current?.width - 105,
          top: fabricRef?.current?.height - 19,
          selectable: false,
        });
        fabricRef?.current?.add(group);
        fabricRef?.current?.renderAll();
      },
      { crossOrigin: "anonymous" }
    );
  };

  const addHeaderTitle = () => {
    const text1 = new fabric.Textbox("Welcome", {
      left: 0,
      top: 0,
      fill: "#ffffff",
      fontSize: 18,
      fontFamily: "Inter",
      fontWeight: 500,
    });
    const text2 = new fabric.Textbox("On Borad!", {
      left: text1.width + 4,
      top: 0,
      fill: "#FDD100",
      fontSize: 18,
      fontFamily: "Inter",
      fontWeight: 600,
      width: 150,
    });
    const group = new fabric.Group([text1, text2], {
      left: 85,
      top: 13,
      selectable: false,
    });
    fabricRef?.current?.add(group);
    fabricRef?.current?.renderAll();
  };

  const addEventTitle = () => {
    const text = new fabric.Textbox(newEvent, {
      left: 0,
      top: 0,
      fill: "#58BDE8",
      fontSize: 13,
      fontFamily: "Inter",
      fontWeight: 500,
      width: 296,
      textAlign: "center",
    });
    let textHeight = text?.height;
    let groupTopCount = 42;
    if (textHeight < 15) {
      groupTopCount = 55;
    } else if (textHeight > 15 && textHeight < 32) {
      groupTopCount = 50;
    } else if (textHeight > 32 && textHeight < 50) {
      groupTopCount = 45;
    } else {
      console.log("ELSE");
    }
    const group = new fabric.Group([text], {
      left: 28,
      top: groupTopCount,
      selectable: false,
    });
    fabricRef?.current?.add(group);
    fabricRef?.current?.renderAll();
  };

  const addSpekerTitle = () => {
    const text = new fabric.Textbox("SESSION SPEAKER", {
      left: 0,
      top: 0,
      fill: "#FDD100",
      fontSize: 13,
      fontFamily: "Inter",
      fontWeight: 500,
      width: fabricRef?.current?.width,
      textAlign: "center",
    });
    const group = new fabric.Group([text], {
      left: 0,
      top: 101,
      selectable: false,
    });
    fabricRef?.current?.add(group);
    fabricRef?.current?.renderAll();
  };

  const addUserImage = async () => {
    const response = await generatePreSignedUrl(
      profile_photo_path,
      profilePath
    );
    fabric.Image.fromURL(
      response,
      (img) => {
        img.scaleToWidth(100);
        img.set({
          left: 124,
          top: 134,
        });
        var circle = new fabric.Circle({
          left: 124,
          top: 134,
          radius: 50,
          fill: "",
          stroke: "#ffffff",
          strokeWidth: 1,
        });
        var circle1 = new fabric.Circle({
          left: 120,
          top: 130,
          radius: 54,
          fill: "",
          stroke: "#ffffff",
          strokeWidth: 1,
        });
        var group = new fabric.Group([img, circle], {
          clipPath: circle,
        });
        fabricRef?.current?.add(group);
        fabricRef?.current?.add(circle1);
        fabricRef?.current?.renderAll();
      },
      { crossOrigin: "anonymous" }
    );
  };

  const addUserInfo = () => {
    const text1 = new fabric.Textbox(name, {
      left: 0,
      top: 0,
      fill: "#ffffff",
      fontSize: 13,
      fontFamily: "Inter",
      fontWeight: 600,
      width: fabricRef?.current?.width,
      textAlign: "center",
    });
    const text2 = new fabric.Textbox(titleCaseString(designation || ""), {
      left: 0,
      top: text1.height + 4,
      fill: "#FDD100",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: 500,
      width: fabricRef?.current?.width,
      textAlign: "center",
    });
    const text3 = new fabric.Textbox(institution_name || instituteName || "", {
      left: 0,
      top: text2.height + 22,
      fill: "#ffffff",
      fontSize: 12,
      fontFamily: "Poppins",
      fontWeight: 400,
      width: fabricRef?.current?.width,
      textAlign: "center",
    });
    const group = new fabric.Group([text1, text2, text3], {
      left: 0,
      top: 257,
      selectable: false,
    });
    fabricRef?.current?.add(group);
    fabricRef?.current?.renderAll();
  };

  const initFabric = () => {
    fabricRef.current = new fabric.Canvas(canvasRef?.current);
    addBackground();
    addFooterContent();
    addHeaderTitle();
    if (event_name) {
      addEventTitle();
    }
    addSpekerTitle();
    if (profile_photo_path) {
      addUserImage();
    }
    if (name) {
      addUserInfo();
    }
    setTimeout(() => {
      const dataURL = fabricRef?.current?.toDataURL({
        format: "jpeg",
        quality: 1,
      });
      onChange(dataURL);
    }, 1000);
  };

  const disposeFabric = () => {
    // fabricRef.current.dispose();
  };

  useEffect(() => {
    if (name && event_name) {
      initFabric();
    }
    return () => {
      disposeFabric();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, event_name]);

  return (
    <div
      className="d-flex justify-content-center"
      style={{
        userSelect: "none",
        pointerEvents: "none",
        position: isVisible ? "" : "absolute",
        top: 0,
        zIndex: isVisible ? "" : "-1",
      }}
    >
      <canvas id="canvas" ref={canvasRef} height={352} width={352} />
    </div>
  );
};

export default SpeakerPoster;
