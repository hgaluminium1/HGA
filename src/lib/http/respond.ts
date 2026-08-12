import { NextResponse } from "next/server";
import type { ApiFailure, ApiResponse, ApiSuccess } from "@/lib/types/api";

export function respondSuccess<T>(
  data: T,
  init?: ResponseInit,
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status: 200, ...init });
}

export function respondError(
  code: string,
  message: string,
  status = 400,
  fields?: Record<string, string>,
): NextResponse<ApiFailure> {
  const body: ApiFailure = {
    success: false,
    error: { code, message, ...(fields ? { fields } : {}) },
  };
  return NextResponse.json(body, { status });
}

export function isApiSuccess<T>(
  value: ApiResponse<T>,
): value is ApiSuccess<T> {
  return value.success === true;
}
