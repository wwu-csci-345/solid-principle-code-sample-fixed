# Code samples of Solid Design Principles

This repository contains code samples that demonstrate the SOLID design principles in software development. Everything is written in Typescript, but the concepts can be applied to any object-oriented programming language.

All examples included in this repository demonstrate some unfortunate design choices that can be improved by applying the SOLID principles.

## SOLID Principles

1. **Single Responsibility Principle (SRP)**: A class should have only one reason to change, meaning it should have only one job or responsibility.

    - Example: OrderReceipt ([./OrderReceipt.ts](./OrderReceipt.ts))
    - Example: GradeReport ([./GradeExporter.ts](./GradeExporter.ts))

2. **Open/Closed Principle (OCP)**: Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.

    - Example: DiscountCalculator ([./DiscountCalculator.ts](./DiscountCalculator.ts))
    - Example: PaymentMethods ([./PaymentMethods.ts](./PaymentMethods.ts))
    - Example: GradeExporter ([./GradeExporter.ts](./GradeExporter.ts))

3. **Liskov Substitution Principle (LSP)**: Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program.

    - Example: Course ([./Course.ts](./Course.ts))
    - Example: UserAccount ([./UserAccount.ts](./UserAccount.ts))

4. **Interface Segregation Principle (ISP)**: Clients should not be forced to depend on interfaces they do not use.

    - Example: LMSCourseActivity ([./LMSCourseActivity.ts](./LMSCourseActivity.ts))
    - Example: Notification ([./Notification.ts](./Notification.ts))

5. **Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

    - Example: UserRegistration ([./UserRegistration.ts](./UserRegistration.ts))
    - Example: BugReport ([./BugReport.ts](./BugReport.ts))