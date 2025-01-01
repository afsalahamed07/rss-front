import { describe, it, expect } from "vitest";
import { cleanHtml } from "../util/parser";

describe("cleanHtml", () => {
  it("should clean CDATA wrapper, comments, unwanted attributes, and extra whitespace", () => {
    const rawHtml = `<![CDATA[ <!-- wp:paragraph --> <p>Ever since I was a boy, I’ve been fascinated with movies. <!-- Comment --> </p> <!-- /wp:paragraph --> ]]>`;
    const expectedHtml = `<p>Ever since I was a boy, I’ve been fascinated with movies. </p>`;

    const result = cleanHtml(rawHtml);
    expect(result).toBe(expectedHtml);
  });

  it("should remove CDATA tags and retain valid HTML", () => {
    const rawHtml = `<![CDATA[<div>Sample content</div>]]>`;
    const expectedHtml = `<div>Sample content</div>`;

    const result = cleanHtml(rawHtml);
    expect(result).toBe(expectedHtml);
  });

  it("should remove unnecessary comments", () => {
    const rawHtml = `<p>This is text. <!-- Unnecessary comment --> Another text.</p>`;
    const expectedHtml = `<p>This is text. Another text.</p>`;

    const result = cleanHtml(rawHtml);
    expect(result).toBe(expectedHtml);
  });

  it("should remove unwanted attributes like JSON metadata", () => {
    const rawHtml = `<div data="info" {"meta":"value"}>Content</div>`;
    const expectedHtml = `<div data="info">Content</div>`;

    const result = cleanHtml(rawHtml);
    expect(result).toBe(expectedHtml);
  });

  it("should clean up extra whitespace", () => {
    const rawHtml = `    <div>   Content   </div>    `;
    const expectedHtml = `<div> Content </div>`;

    const result = cleanHtml(rawHtml);
    expect(result).toBe(expectedHtml);
  });

  it("should trim leading and trailing whitespace from the result", () => {
    const rawHtml = `   <div>Content</div>   `;
    const expectedHtml = `<div>Content</div>`;

    const result = cleanHtml(rawHtml);
    expect(result).toBe(expectedHtml);
  });
});
