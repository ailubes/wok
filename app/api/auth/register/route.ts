/**
 * User Registration API Endpoint
 *
 * POST /api/auth/register
 * Creates a new user account with hashed password
 *
 * Request body:
 * - email: string (required, must be unique)
 * - password: string (required, min 8 characters)
 * - fullName: string (required)
 * - organization: string (optional)
 * - role: UserRole (optional, defaults to MEMBER)
 *
 * Response:
 * - 201: User created successfully
 * - 400: Validation error
 * - 409: User already exists
 * - 500: Server error
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validateEmail, validatePassword } from "@/lib/auth-helpers";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password, fullName, organization, role } = body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user with specified role or default MEMBER role
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        organization: organization || null,
        role: role || UserRole.MEMBER,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        organization: true,
        role: true,
        createdAt: true,
      },
    });

    // Return success response (without password hash)
    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
