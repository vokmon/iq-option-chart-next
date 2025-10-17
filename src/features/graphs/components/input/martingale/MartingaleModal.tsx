import MartingaleForm from "@/components/input/MartingaleForm";
import { MartingaleSettings } from "@/types/martingale";
import { Button, Modal } from "@mantine/core";

type MartingaleModalProps = {
  opened: boolean;
  onClose: () => void;
  martingale: MartingaleSettings;
  updateMartingale: (settings: MartingaleSettings) => void;
};

export default function MartingaleModal({
  opened,
  onClose,
  martingale,
  updateMartingale,
}: MartingaleModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Martingale"
      size="lg"
      radius="lg"
      className="bg-gray-800 z-1000 relative"
    >
      <div className="flex flex-col gap-4 justify-center items-center">
        <MartingaleForm
          martingale={martingale}
          updateMartingale={updateMartingale}
        />
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
