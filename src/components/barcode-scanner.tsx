"use client";

import { BrowserCodeReader, BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// The green box shown to the user is the exact same region decoding reads
// from — see ensureScanRegionCrop below. Short and wide, since that's the
// shape of a 1D barcode, not a square.
const SCAN_REGION_WIDTH = 0.75;
const SCAN_REGION_HEIGHT = 0.32;

// zxing's own docs call `drawImageOnCanvas` the intended override point
// ("manipulate the snapshot image in any way you want before decode"). It's
// invoked internally as the hardcoded `BrowserCodeReader.drawImageOnCanvas(...)`,
// not through `this`, so subclassing wouldn't work — patching the static
// property (once, at module load) is the only hook available.
//
// Cropping to the on-screen green box and stretching that crop back up to
// the full canvas is what fixes small/far-away barcodes: the decoder always
// sees the box's contents blown up to full frame, so the bars get far more
// pixels than they would scanning the whole (much wider) camera view.
let scanRegionPatched = false;
function ensureScanRegionCrop() {
  if (scanRegionPatched) return;
  scanRegionPatched = true;
  BrowserCodeReader.drawImageOnCanvas = (ctx, source) => {
    const { width, height } = BrowserCodeReader.getMediaElementDimensions(source);
    const cropWidth = width * SCAN_REGION_WIDTH;
    const cropHeight = height * SCAN_REGION_HEIGHT;
    const cropX = (width - cropWidth) / 2;
    const cropY = (height - cropHeight) / 2;
    ctx.drawImage(
      source,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
  };
}

// TRY_HARDER makes zxing spend extra effort per frame (worth it here since we
// only decode a few times a second), and restricting to the retail/product
// barcode formats we actually care about avoids wasted attempts against
// formats like QR/Aztec/PDF417 that were slowing down and diluting each scan.
const HINTS = new Map<DecodeHintType, unknown>([
  [DecodeHintType.TRY_HARDER, true],
  [
    DecodeHintType.POSSIBLE_FORMATS,
    [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.ITF,
    ],
  ],
]);

export function BarcodeScanner({
  onScan,
  onClose,
}: {
  onScan: (code: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureScanRegionCrop();
    const reader = new BrowserMultiFormatReader(HINTS);
    let cancelled = false;

    reader
      .decodeFromConstraints(
        {
          video: {
            facingMode: "environment",
            // A higher-resolution capture gives the cropped scan region more
            // source pixels to work with, which is what actually lets small
            // barcodes resolve — the visual crop alone can't invent detail
            // the camera didn't capture.
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        },
        videoRef.current ?? undefined,
        (result) => {
          if (result && !cancelled) {
            cancelled = true;
            controlsRef.current?.stop();
            onScan(result.getText());
          }
        }
      )
      .then((controls) => {
        controlsRef.current = controls;
        // Real hardware zoom (where the device exposes it) gives the sensor
        // itself more detail to work with, on top of the crop-and-stretch
        // trick above — the crop alone is limited by what the 1920x1080
        // capture already contains. Experimental/Chromium-only and absent
        // on iOS Safari and most webcams, so this is best-effort: read the
        // track's zoom range and step partway into it rather than assuming
        // any particular value is supported.
        try {
          const capabilities = controls.streamVideoCapabilitiesGet?.(
            (track) => [track]
          ) as (MediaTrackCapabilities & { zoom?: { min: number; max: number } }) | undefined;
          const zoomRange = capabilities?.zoom;
          if (zoomRange) {
            const zoom = zoomRange.min + (zoomRange.max - zoomRange.min) * 0.4;
            controls.streamVideoConstraintsApply?.({
              advanced: [{ zoom } as MediaTrackConstraintSet],
            });
          }
        } catch {
          // Zoom isn't universally supported — the crop-based fix still applies.
        }
      })
      .catch(() => {
        setError(
          "Couldn't access the camera. Check camera permissions and try again."
        );
      });

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div className="relative overflow-hidden rounded-md">
          <video
            ref={videoRef}
            className="aspect-video w-full bg-black object-cover"
            muted
            playsInline
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="rounded-lg border-[3px] border-green-400"
              style={{
                width: `${SCAN_REGION_WIDTH * 100}%`,
                height: `${SCAN_REGION_HEIGHT * 100}%`,
                boxShadow:
                  "0 0 0 9999px rgba(0, 0, 0, 0.55), 0 0 16px 2px rgba(74, 222, 128, 0.7)",
              }}
            />
          </div>
        </div>
      )}
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
    </div>
  );
}
