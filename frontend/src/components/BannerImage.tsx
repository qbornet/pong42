interface BannerImageProps {
  children: React.ReactNode;
}

export function BannerImage({ children }: BannerImageProps) {
  return (
    <div className="flex h-fit w-3/4 flex-col items-center justify-center rounded-[20px] bg-profile-default bg-cover bg-center">
      {children}
    </div>
  );
}
