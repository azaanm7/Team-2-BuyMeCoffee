import Image from "next/image";

type QPayDisplayProps = {
  qrCodeUrl: string | null;
};

export default function QPayDisplay({ qrCodeUrl }: QPayDisplayProps) {
  return (
    <>
      <p className="mt-4 text-sm text-gray-500">
        Scan this QR code with your phone to complete the payment.
      </p>

      {qrCodeUrl && (
        <Image
          src={qrCodeUrl}
          width={260}
          height={260}
          alt="Payment QR code"
          unoptimized
          className="mx-auto mt-6"
        />
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
        Waiting for payment…
      </div>
    </>
  );
}
