// src/app/api/otp/route.ts
import prisma from '~/server/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the JSON body
    console.log(body); // Log the parsed body

    const email = body.email; // Extract the email or other data from the parsed body
    const password = body.password;
     // Extract the email or other data from the parsed body
     const user = await prisma.user.findUnique({ where: { email: email }  });

      if (!user) {
        return NextResponse.json({ status: false, msg: "plese enter valid email"  });
        
      }
      if (!user.verified) {
        return NextResponse.json({ status: false, msg: " email  is not verified"  });
       
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json({ status: false, msg: "plese check your password"  });
      }


      const token = jwt.sign({email:email},process.env.SECREAT)

      
      

   

    return NextResponse.json({ status: true, msg: "login succesfull", token: token  });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ status: false, msg: "Invalid JSON" }, { status: 400 });
  }
}
