// Optional regeneration on macOS. The generated PNG is checked in as a static asset.
import AppKit
let width = 1200, height = 630
let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: width * 4, bitsPerPixel: 32)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
func color(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat) -> NSColor { NSColor(calibratedRed:r/255, green:g/255, blue:b/255, alpha:1) }
let background = color(13,14,16), foreground = color(244,241,234), muted = color(184,188,195), orange = color(255,107,44)
background.setFill(); NSRect(x:0,y:0,width:width,height:height).fill()
func text(_ value: String, _ x: CGFloat, _ y: CGFloat, _ size: CGFloat, _ foregroundColor: NSColor, _ bold: Bool = false) {
  let attributes: [NSAttributedString.Key:Any] = [.font:NSFont.systemFont(ofSize:size,weight:bold ? .bold : .regular),.foregroundColor:foregroundColor]
  NSAttributedString(string:value,attributes:attributes).draw(at:NSPoint(x:x,y:y))
}
color(53,56,60).setFill(); NSRect(x:70,y:530,width:1060,height:1).fill(); NSRect(x:70,y:94,width:1060,height:1).fill()
text("Basanta Parajuli",70,555,25,foreground,true)
text("BUSINESS MARKETING PARTNER",70,450,17,muted)
text("Your marketing partner",65,329,73,foreground,true)
text("for finance businesses.",65,232,73,orange,true)
text("For finance coaches and financial consultants.",70,152,25,muted)
text("Offer messaging, email sequences, and landing pages.",70,42,21,foreground)
NSGraphicsContext.restoreGraphicsState()
try bitmap.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:"public/assets/social-card.png"))
print("Created public/assets/social-card.png (1200 × 630)")
