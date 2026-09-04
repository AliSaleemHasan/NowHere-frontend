import { leaveToHome, resetToHome } from "../navigation";

function mockRouter(
  options: { canDismiss?: boolean; canGoBack?: boolean } = {},
) {
  return {
    canDismiss: jest.fn(() => options.canDismiss ?? false),
    dismiss: jest.fn(),
    canGoBack: jest.fn(() => options.canGoBack ?? false),
    back: jest.fn(),
    replace: jest.fn(),
  };
}

describe("leaveToHome", () => {
  it("dismisses a modal when one is open", () => {
    const router = mockRouter({ canDismiss: true, canGoBack: true });
    leaveToHome(router);
    expect(router.dismiss).toHaveBeenCalledTimes(1);
    expect(router.back).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("goes back when there is history", () => {
    const router = mockRouter({ canGoBack: true });
    leaveToHome(router);
    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("replaces to the map when the user would otherwise be stuck", () => {
    const router = mockRouter();
    leaveToHome(router);
    expect(router.replace).toHaveBeenCalledWith("/");
  });
});

describe("resetToHome", () => {
  it("always replaces to the map", () => {
    const router = mockRouter({ canDismiss: true, canGoBack: true });
    resetToHome(router);
    expect(router.replace).toHaveBeenCalledWith("/");
  });
});
