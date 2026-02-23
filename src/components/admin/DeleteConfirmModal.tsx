
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[400px] p-8 rounded-[16px] border-none shadow-2xl bg-white text-[#0A0D12]">
        <div className="flex flex-col gap-4">
          <h2 className="text-[20px] font-bold text-[#0A0D12]">Delete Data</h2>
          <p className="text-[14px] text-[#667085] font-medium leading-relaxed">
            Once deleted, you won't be able to recover this data.
          </p>
          
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 h-[48px] rounded-full border border-[#EAECF0] text-[16px] font-bold text-[#0A0D12] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 h-[48px] rounded-full bg-[#EE1D52] hover:bg-[#D41A48] text-[16px] font-bold text-white transition-colors"
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
