import { revalidateTag } from "next/cache";

export function revalidatePages() {
  revalidateTag("pages");
}

export function revalidateProducts() {
  revalidateTag("products");
}

export function revalidateCategories() {
  revalidateTag("categories");
}

export function revalidateMedia() {
  revalidateTag("media");
}

export function revalidateCorporate() {
  revalidateTag("corporate");
}

export function revalidateCapacity() {
  revalidateTag("capacity");
}
