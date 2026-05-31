import os

from PIL import Image, ImageDraw, ImageFont

# Constants for Instagram Carousel (Portrait - Maximum Screen Real Estate)
WIDTH, HEIGHT = 1080, 1350
BG_COLOR = "#050505"  # Pure deep black
TEXT_COLOR = "#FFFFFF"  # Stark white
SECONDARY_TEXT = "#666666"  # Muted gray for the footer


class CarouselGenerator:
    def __init__(self, output_dir="output"):
        self.output_dir = output_dir
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.abs_output_dir = os.path.join(script_dir, output_dir)
        os.makedirs(self.abs_output_dir, exist_ok=True)

        # Try to find a system font (Windows specific)
        self.font_path_bold = "C:\\Windows\\Fonts\\arialbd.ttf"
        self.font_path_reg = "C:\\Windows\\Fonts\\arial.ttf"

        if not os.path.exists(self.font_path_bold):
            self.font_path_bold = None
            self.font_path_reg = None

    def get_font(self, size, bold=False):
        path = self.font_path_bold if bold else self.font_path_reg
        try:
            if path:
                return ImageFont.truetype(path, size)
        except Exception:
            pass
        return ImageFont.load_default()

    def wrap_text(self, text, font, max_width):
        lines = []
        words = text.split()
        while words:
            line = ""
            while words and font.getlength(line + words[0]) <= max_width:
                line += words.pop(0) + " "
            lines.append(line.strip())
        return lines

    def create_slide(self, index, text, slide_count):
        img = Image.new("RGB", (WIDTH, HEIGHT), color=BG_COLOR)
        draw = ImageDraw.Draw(img)

        # Fonts - MASSIVELY scaled up for the "Wealth" aesthetic
        main_font = self.get_font(84, bold=True)
        footer_font = self.get_font(28)

        # Text Wrapping (Centered)
        max_text_width = WIDTH - 200  # Leave 100px breathing room on each side
        wrapped_text = self.wrap_text(text, main_font, max_text_width)

        # Calculate total height of the text block to center it vertically
        line_heights = [
            draw.textbbox((0, 0), line, font=main_font)[3] for line in wrapped_text
        ]
        total_text_height = sum(line_heights) + (len(wrapped_text) - 1) * 30

        y_cursor = (HEIGHT - total_text_height) // 2

        # Draw Centered Text
        for line in wrapped_text:
            bbox = draw.textbbox((0, 0), line, font=main_font)
            line_width = bbox[2] - bbox[0]
            x_cursor = (WIDTH - line_width) // 2  # Center horizontally

            draw.text((x_cursor, y_cursor), line, font=main_font, fill=TEXT_COLOR)
            y_cursor += line_heights[0] + 30

        # Draw Footer / Branding (Centered at bottom)
        footer_text = "Λ X I O M"
        f_bbox = draw.textbbox((0, 0), footer_text, font=footer_font)
        draw.text(
            ((WIDTH - (f_bbox[2] - f_bbox[0])) // 2, HEIGHT - 120),
            footer_text,
            font=footer_font,
            fill=SECONDARY_TEXT,
        )

        # Page Indicator (Bottom right)
        if index + 1 < slide_count:
            indicator = "Swipe →"
        else:
            indicator = "Link in bio."

        i_bbox = draw.textbbox((0, 0), indicator, font=footer_font)
        draw.text(
            (WIDTH - 100 - (i_bbox[2] - i_bbox[0]), HEIGHT - 120),
            indicator,
            font=footer_font,
            fill=SECONDARY_TEXT,
        )

        # Save
        filename = f"slide_{index + 1}.png"
        save_path = os.path.join(self.abs_output_dir, filename)
        img.save(save_path)
        print(f"Generated: {save_path}")


def main():
    # The "Wealth" Page Copy Strategy: Short, punchy, aggressive.
    slides = [
        "Stop tracking your expenses. It's keeping you broke.",
        "Tracking is a history lesson. It only tells you where your money went after it's too late.",
        "The wealthy don't track. They allocate.",
        "Every shilling you spend is either an Asset, a Skill, Leverage, or Leakage.",
        "Stop guessing. Establish your Day Zero financial baseline today.",
    ]

    generator = CarouselGenerator()
    for i, text in enumerate(slides):
        generator.create_slide(i, text, len(slides))


if __name__ == "__main__":
    main()
