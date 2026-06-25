type CoverBannerProps = {
  backgroundImage?: string | null;
};

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
