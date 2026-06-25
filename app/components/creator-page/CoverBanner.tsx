type CoverBannerProps = {
  backgroundImage?: string | null;
};

// Read-only cover banner for a creator's public page. Unlike the owner's
// donation/edit page, visitors never see upload controls here — the cover
// is just shown as-is, falling back to a plain color block if none is set.
export default function CoverBanner({ backgroundImage }: CoverBannerProps) {
  return (
    <div
      className="relative h-95 w-full bg-[#40b495]"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    />
  );
}
