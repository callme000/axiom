import os
from io import BytesIO

import requests
from PIL import Image, ImageDraw, ImageEnhance, ImageFont


# Load environment variables (manual simple load)
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if "=" in line:
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value.strip('"').strip("'")


load_env()

# Constants
WIDTH, HEIGHT = 1080, 1080
MARGIN = 80
BG_COLOR = "#0a0a0a"
TEXT_COLOR = "#ededed"
ACCENT_COLOR = "#3b82f6"
SECONDARY_TEXT = "#999999"
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "your_key_here")


class CarouselGeneratorAPI:
    def __init__(self, output_dir="output"):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.abs_output_dir = os.path.join(script_dir, output_dir)
        os.makedirs(self.abs_output_dir, exist_ok=True)

        # Fonts
        self.font_path_bold = "C:\\Windows\\Fonts\\arialbd.ttf"
        self.font_path_reg = "C:\\Windows\\Fonts\\arial.ttf"

    def get_font(self, size, bold=False):
        path = self.font_path_bold if bold else self.font_path_reg
        try:
            if path and os.path.exists(path):
                return ImageFont.truetype(path, size)
        except Exception:
            pass
        return ImageFont.load_default()

    # 1. NEW: Add the text wrapping logic back
    def wrap_text(self, text, font, max_width):
        lines = []
        words = text.split()
        while words:
            line = ""
            while words and font.getlength(line + words[0]) <= max_width:
                line += words.pop(0) + " "
            lines.append(line.strip())
        return lines

    def fetch_unsplash_background(self, query):
        print(f"Fetching background for: {query}")
        if UNSPLASH_ACCESS_KEY == "your_key_here":
            print("Warning: Unsplash API key not set. Using fallback color.")
            return None

        url = f"https://api.unsplash.com/photos/random?query={query}&orientation=squarish&client_id={UNSPLASH_ACCESS_KEY}"
        try:
            response = requests.get(url, timeout=10)
            data = response.json()
            image_url = data["urls"]["regular"]
            img_response = requests.get(image_url)
            img = Image.open(BytesIO(img_response.content))
            return img.resize((WIDTH, HEIGHT))
        except Exception as e:
            print(f"Error fetching image: {e}")
            return None

    def create_slide(self, index, text, slide_count, bg_image=None):
        img = (
            bg_image.copy()
            if bg_image
            else Image.new("RGB", (WIDTH, HEIGHT), color=BG_COLOR)
        )

        # Darken image for readability
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(0.4)

        draw = ImageDraw.Draw(img)

        # Fonts
        title_font = self.get_font(72, bold=True)
        footer_font = self.get_font(24)

        # 2. UPDATED: Handle both manual \n and automatic width wrapping
        # Replace explicit escaped newlines just in case they come through as raw strings
        raw_lines = text.replace("\\n", "\n").split("\n")
        final_lines = []
        max_text_width = WIDTH - (MARGIN * 2)  # Leave 80px breathing room on each side

        for raw_line in raw_lines:
            wrapped = self.wrap_text(raw_line, title_font, max_text_width)
            final_lines.extend(wrapped)

        # Dynamically calculate Y cursor so the whole block stays perfectly centered
        line_spacing = 90
        total_height = len(final_lines) * line_spacing
        y_cursor = (HEIGHT - total_height) // 2

        for line in final_lines:
            w = title_font.getlength(line)
            draw.text(
                ((WIDTH - w) // 2, y_cursor), line, font=title_font, fill=TEXT_COLOR
            )
            y_cursor += line_spacing

        # Branding
        footer_text = "Λ X I O M"  # Updated to match your high-end brand mark
        draw.text(
            (MARGIN, HEIGHT - MARGIN),
            footer_text,
            font=footer_font,
            fill=SECONDARY_TEXT,
        )

        indicator = f"{index + 1} / {slide_count}"
        draw.text(
            (WIDTH - MARGIN - 60, HEIGHT - MARGIN),
            indicator,
            font=footer_font,
            fill=TEXT_COLOR,
        )

        filename = f"api_slide_{index + 1}.png"
        save_path = os.path.join(self.abs_output_dir, filename)
        img.save(save_path)
        print(f"Generated: {save_path}")


def main():
    # CONFIGURATION
    THEME = "dark abstract geometric shapes, black marble, clinical white lights, moody minimalism"
    SLIDES = [
        "1: Your financial decisions are compromised.\\nEgo and fear are taxing your capital.",
        "2: You buy to simulate status.\\nYou avoid auditing your accounts because of anxiety.\\nEmotion is the enemy of efficiency.",
        "3: The elite do not operate on feelings.\\nThey operate on strict, unforgiving systems.\\nMath dictates their deployment.",
        "4: Axiom strips the emotion out of your operations.\\nOur intelligence engine calculates your structural solvency with zero judgment.\\nJust cold, deterministic truth.",
        "5: Stop operating on feelings.\\nEstablish your Day Zero Baseline today.\\nLink in bio.",
    ]

    generator = CarouselGeneratorAPI()

    for i, slide_text in enumerate(SLIDES):
        # Fetch a unique background for every slide
        bg = generator.fetch_unsplash_background(THEME)

        # Remove the leading "X: " prefix if present
        clean_text = slide_text.split(": ", 1)[-1] if ": " in slide_text else slide_text
        generator.create_slide(i, clean_text, len(SLIDES), bg)


if __name__ == "__main__":
    main()
