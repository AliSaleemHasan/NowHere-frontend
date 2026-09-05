import { i18n } from "@/lib/i18n";
import { Tags } from "@/utils";
import { render } from "@testing-library/react-native";
import React from "react";
import { I18nextProvider } from "react-i18next";
import TagIcon from "../TagIcon";

describe("TagIcon", () => {
  it("renders a tinted glyph for each selectable tag", async () => {
    await i18n.changeLanguage("en");
    const { getByTestId, getByLabelText } = render(
      <I18nextProvider i18n={i18n}>
        <TagIcon tag={Tags.HIDDEN_GEM} size={18} color="#06b6d4" />
      </I18nextProvider>,
    );

    expect(getByTestId("tag-icon")).toBeTruthy();
    expect(getByLabelText("Hidden gem")).toBeTruthy();
  });

  it("falls back to the social glyph for unknown tags", () => {
    const { getByTestId } = render(<TagIcon tag="not-a-tag" />);
    expect(getByTestId("tag-icon")).toBeTruthy();
  });
});
