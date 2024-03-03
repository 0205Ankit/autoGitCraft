export type FormDataType = {
  "repo-name": string;
  visibility: string;
};

export default async function automateScript({
  formData,
}: {
  formData: FormDataType;
}) {
  const { "repo-name": repoName, visibility } = formData;
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab) throw new Error("No tab found");
  return new Promise<string>((resolve, reject) => {
    try {
      let url = "https://github.com";

      chrome.tabs.update(tab.id!, {
        url: `https://github.com/new?name=${repoName}&visibility=${visibility}`,
      });

      chrome.cookies.get({ url, name: "dotcom_user" }, (cookie) => {
        if (cookie) {
          url = `https://github.com/${cookie.value}/${repoName}`;
        }
      });

      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id ?? 0 },
          func: async () => {
            const form = document.querySelector(
              "form[novalidate]"
            ) as HTMLFormElement;

            if (form) {
              const submitButton = form.querySelector(
                "button[type='submit']"
              ) as HTMLButtonElement;
              if (submitButton) {
                submitButton.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                submitButton.click();
              }
            } else {
              throw new Error("No form found");
            }
          },
        });
        resolve(url);
      }, 3000);
    } catch (err) {
      reject();
      throw new Error("Something went wrong");
    }
  });
}
