import { Resend } from "resend";

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return new Resend(apiKey);
};

export const sendMagicLinkEmail = async (email: string, url: string) => { 
  const resend = getResend();
  await resend.emails.send({
    to: email,
    template: {
      id: "b727acfa-2a3c-4974-b14f-04336e3159c7",
      variables: {
        MAGIC_LINK: url,
      },
    },
  });
}