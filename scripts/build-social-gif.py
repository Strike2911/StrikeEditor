from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
BASE_PATH = ROOT / "public" / "og.png"
FRAMES_DIR = ROOT / "work" / "social-gif-frames"

CAT_HANDS = Path(
    r"C:\Users\kingc\AppData\Local\Temp\codex-clipboard-d870e71a-c280-4747-be93-412aeb0cbe0f.png"
)
RYAN = Path(
    r"C:\Users\kingc\AppData\Local\Temp\codex-clipboard-4ed65f37-15ef-46e1-a572-ae41019d8cfa.png"
)
CAT_PC = Path(
    r"C:\Users\kingc\AppData\Local\Temp\codex-clipboard-500d31bb-c49d-4b95-a7fb-06b71de0f557.png"
)

WIDTH, HEIGHT = 1200, 630
FPS = 12
DURATION = 6
FRAME_COUNT = FPS * DURATION

# Exact timeline windows in the approved 1200 x 630 card.
CLIPS = (
    (65, 478, 286, 545),
    (295, 478, 469, 545),
    (478, 478, 667, 545),
)


def cover_without_distortion(source: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    """Crop to fill while preserving the original aspect ratio."""
    target_w = box[2] - box[0]
    target_h = box[3] - box[1]
    return ImageOps.fit(
        source.convert("RGB"),
        (target_w, target_h),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )


def radial_glow(
    size: tuple[int, int],
    center: tuple[int, int],
    radius: int,
    color: tuple[int, int, int],
    opacity: int,
) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x, y = center
    draw.ellipse(
        (x - radius // 3, y - radius // 3, x + radius // 3, y + radius // 3),
        fill=(*color, opacity),
    )
    return layer.filter(ImageFilter.GaussianBlur(radius // 2))


def screen(base: Image.Image, effect: Image.Image) -> Image.Image:
    rgb = ImageChops.screen(base.convert("RGB"), effect.convert("RGB"))
    alpha = ImageChops.lighter(base.getchannel("A"), effect.getchannel("A"))
    return Image.merge("RGBA", (*rgb.split(), alpha))


def prepare_base() -> Image.Image:
    base = Image.open(BASE_PATH).convert("RGBA")
    if base.size != (WIDTH, HEIGHT):
        base = base.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)

    sources = (CAT_HANDS, CAT_PC, RYAN)
    for source_path, box in zip(sources, CLIPS):
        with Image.open(source_path) as source:
            clip = cover_without_distortion(source, box)
        base.paste(clip, box[:2])

    # Restore crisp clip borders after placing the undistorted source images.
    border = ImageDraw.Draw(base)
    for box in CLIPS:
        border.rectangle(box, outline=(43, 111, 255, 235), width=2)

    # Remove the baked-in playhead so the animated one can move cleanly.
    base.paste(base.crop((420, 447, 437, 562)), (436, 447))
    return base


def add_motion(base: Image.Image, frame_index: int) -> Image.Image:
    phase = frame_index / FRAME_COUNT
    pulse = 0.5 - 0.5 * math.cos(phase * math.tau)
    frame = base.copy()

    # Deep blue pulse around the avatar and the timeline.
    blue_glow = radial_glow(
        frame.size,
        (970, 300),
        470,
        (8, 75, 255),
        int(18 + 24 * pulse),
    )
    frame = screen(frame, blue_glow)

    # Trust badge glow: restrained gold, synced slightly off the blue pulse.
    gold_pulse = 0.5 + 0.5 * math.sin(phase * math.tau + 0.7)
    gold_glow = radial_glow(
        frame.size,
        (91, 582),
        150,
        (255, 174, 28),
        int(25 + 45 * gold_pulse),
    )
    frame = screen(frame, gold_glow)

    # Cinematic diagonal light sweep that never covers the typography heavily.
    sweep = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    sweep_draw = ImageDraw.Draw(sweep)
    sweep_x = int(610 + 760 * math.sin(phase * math.tau))
    sweep_draw.polygon(
        [
            (sweep_x - 120, 0),
            (sweep_x - 18, 0),
            (sweep_x + 175, HEIGHT),
            (sweep_x + 45, HEIGHT),
        ],
        fill=(28, 102, 255, 30),
    )
    sweep = sweep.filter(ImageFilter.GaussianBlur(22))
    frame = Image.alpha_composite(frame, sweep)

    # Animated playhead, clip focus and rhythmic editing ticks.
    motion = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(motion)
    playhead_phase = phase
    playhead_x = int(CLIPS[0][0] + (CLIPS[-1][2] - CLIPS[0][0]) * playhead_phase)
    fade = min(1.0, playhead_phase / 0.07, (1.0 - playhead_phase) / 0.07)
    playhead_alpha = int(255 * max(0.0, fade))
    draw.line((playhead_x, 450, playhead_x, 563), fill=(28, 102, 255, playhead_alpha), width=3)
    draw.polygon(
        [(playhead_x - 8, 450), (playhead_x + 8, 450), (playhead_x, 461)],
        fill=(28, 102, 255, playhead_alpha),
    )
    for i, box in enumerate(CLIPS):
        distance = abs((i + 0.5) / 3 - playhead_phase)
        focus = max(0.0, 1.0 - distance * 5.0)
        if focus:
            draw.rectangle(box, outline=(84, 155, 255, int(120 + 135 * focus)), width=3)

    # Moving scan line and tiny equalizer bars sell the motion-graphics language.
    scan_y = int(448 + 116 * (0.5 - 0.5 * math.cos(phase * math.tau)))
    draw.line((58, scan_y, 674, scan_y), fill=(130, 190, 255, 55), width=1)
    for i in range(7):
        bar_x = 694 + i * 10
        bar_h = 5 + int(16 * (0.5 + 0.5 * math.sin(phase * math.tau * 3 + i * 0.9)))
        draw.rounded_rectangle(
            (bar_x, 535 - bar_h, bar_x + 4, 535),
            radius=2,
            fill=(72, 139, 255, 110),
        )
    motion = motion.filter(ImageFilter.GaussianBlur(0.35))
    frame = Image.alpha_composite(frame, motion)

    # Two-frame RGB split accents near the loop beats; confined to STRIKE.
    beat = frame_index % (FPS * 3)
    if beat in (1, 2):
        title = frame.crop((55, 48, 632, 311)).convert("RGB")
        red, green, blue = title.split()
        shifted = Image.merge(
            "RGB",
            (
                ImageChops.offset(red, 5, 0),
                green,
                ImageChops.offset(blue, -5, 0),
            ),
        ).convert("RGBA")
        frame.alpha_composite(shifted, (55, 48))

    # Subtle cyclic camera push keeps the loop alive without warping anything.
    zoom = 1.0 + 0.009 * pulse
    scaled = frame.resize(
        (round(WIDTH * zoom), round(HEIGHT * zoom)),
        Image.Resampling.LANCZOS,
    )
    left = (scaled.width - WIDTH) // 2
    top = (scaled.height - HEIGHT) // 2
    frame = scaled.crop((left, top, left + WIDTH, top + HEIGHT))

    # Deterministic, very light film-grain sparkle.
    grain = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    grain_draw = ImageDraw.Draw(grain)
    rng = random.Random(9200 + frame_index)
    for _ in range(180):
        x = rng.randrange(WIDTH)
        y = rng.randrange(HEIGHT)
        a = rng.randrange(4, 15)
        grain_draw.point((x, y), fill=(200, 220, 255, a))
    frame = Image.alpha_composite(frame, grain)
    return ImageEnhance.Contrast(frame.convert("RGB")).enhance(1.015)


def main() -> None:
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    for old_frame in FRAMES_DIR.glob("frame-*.png"):
        old_frame.unlink()

    base = prepare_base()
    # Save the corrected static fallback with the PC cat and undistorted clips.
    base.convert("RGB").save(BASE_PATH, "PNG", optimize=True)

    for frame_index in range(FRAME_COUNT):
        frame = add_motion(base, frame_index)
        frame.save(FRAMES_DIR / f"frame-{frame_index:03d}.png", optimize=False)

    print(f"Created {FRAME_COUNT} frames at {FPS} fps in {FRAMES_DIR}")


if __name__ == "__main__":
    main()
