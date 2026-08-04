import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-ink/60">
        Sepertinya kamu tersesat. Yuk kembali ke beranda.
      </p>
      <Link to="/">
        <Button className="mt-6">Kembali ke Home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
