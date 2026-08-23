import { KEYS } from "@excalidraw/common";

import { Excalidraw } from "../..";
import { Keyboard } from "../../tests/helpers/ui";
import { act, render, waitFor, fireEvent } from "../../tests/test-utils";

describe("FontPicker", () => {
  it("should be able to open font picker", async () => {
    (global as any).ResizeObserver =
      (global as any).ResizeObserver ||
      class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      };

    const { queryByTestId } = await render(
      <Excalidraw handleKeyboardGlobally={true} />,
    );

    Keyboard.keyPress(KEYS.T);

    const fontPickerTrigger = queryByTestId("font-family-show-fonts");

    expect(fontPickerTrigger).not.toBeNull();

    act(() => {
      fontPickerTrigger!.click();
    });
  });

  it("should show no-results message when search yields no matches", async () => {
    (global as any).ResizeObserver =
      (global as any).ResizeObserver ||
      class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      };

    const { queryByTestId, queryByPlaceholderText } = await render(
      <Excalidraw handleKeyboardGlobally={true} />,
    );

    Keyboard.keyPress(KEYS.T);

    const fontPickerTrigger = queryByTestId("font-family-show-fonts");
    expect(fontPickerTrigger).not.toBeNull();

    act(() => {
      fontPickerTrigger!.click();
    });

    const searchInput = queryByPlaceholderText("Quick search");
    if (searchInput) {
      act(() => {
        fireEvent.change(searchInput, {
          target: { value: "xxxxnonexistent" },
        });
      });

      await waitFor(() => {
        const noResults = queryByTestId("font-picker-no-results");
        expect(noResults).not.toBeNull();
      });
    }
  });
});
