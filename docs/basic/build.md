---
title: 构建
layout: doc
navbar: true
sidebar: true
aside: true
outline: deep
lastUpdated: true
editLink: true
footer: true
---

# 构建

## 编译流程

1. 预处理: 处理代码中的所有预处理指令, 例如`#include`和`#define`等. 将这些指令替换成对应的代码, 生成一个新的文本文件, 作为编译器的输入. 在预处理的过程中, 还会进行条件编译, 即根据条件来选择是否编译某些代码块. 预处理完成之后, 会生成一个没有宏定义和条件编译的中间文件. 
    ::: tip
    `#include <stdio.h>`类似的`.h`头文件中只是包含了库函数的声明, 而不是具体的实现, 函数的具体实现存储在动态库(`.so`或`.dll`文件)或静态库(`.a`或`.lib`文件)中. 具体请见链接.
2. 编译: 编译器将代码进行词法, 语法和语义分析, 转化为中间代码. 中间代码是比汇编语言更加高级的表示, 便于优化和移植. 在编译的最后阶段, 编译器会对中间代码进行优化处理, 生成汇编代码, 将其编译成独立的对象文件. 对象文件中包含了当前模块的二进制代码和未定义的符号引用(例如调用的外部库函数, `printf`...), 这些未定义的引用会在后续链接阶段解析
3. 汇编: 中间代码会被汇编器转化为机器指令, 这些指令可以被计算机直接执行. 这个阶段生成的代码会以目标文件的形式存储, 等待连接阶段的处理
4. 链接: 将所有生成的目标文件和已有的库文件合并, 解决各个文件之间的符号引用, 生成最终的可执行文件. 

   每个目标文件(如`.o`)文件都包含了符号表, 记录了函数和全局变量的定义和引用. 符号分为两类: 已定义符号和未定义符号, 前者表示当前目标文件中已经实现的函数和变量, 后者表示的是当前目标文件中引用但是未定义的符号, 需要在其他目标文件或者库文件中查找, 链接器将解析这些符号, 确保每个未定义符号都能在其他文件中找到定义, 否则报错. 

   链接方式分为动态链接和静态链接, 静态链接是在链接阶段将库文件中的代码复制到可执行文件中, 静态库通常以`.a`(Linux)或`.lib`(Windows)为后缀. 它的有点是可执行文件不依赖外部库, 运行的时候无需加载其他文件, 每个程序包含所需的所有代码, 移植性强. 缺点是静态链接后产生的可执行文件的体积较大. 因为每个程序都包含库代码的副本. 更新库的时候, 需要重新链接. 动态链接不将库代码复制到可执行文件中. 动态库文件通常以`.so`或`.dll`(Windows)为后缀. 优点是可执行文件体积小, 不包含库代码的副本. 多个程序可以共享同一个动态库节省内存. 更新库的时候无需重新链接, 只需要替换库文件. 缺点是运行的时候需要加载动态库, 如果库版本不兼容(例如换了一台电脑, 操作系统)可能导致程序奔溃或者功能错误.

![](https://img.ricolxwz.io/5b0f8fb7c7384ba297ab23fd0cb1222e.png){style="display: block; margin: 0 auto; width: 90%;"}


## 工具链

### MSVC和Windows SDK

在Windows上进行开发C/C++开发, MSVC(Microsoft Visual C++)和Windows SDK是必不可少的工具, 这两个工具各有特定的职责和作用.

MSVC是Microsoft提供的一套C/C++开发工具链, 包含了一系列支持编译, 链接, 调试等工具. MSVC并不是单一的编译器或者链接器, 而是一个工具集, 涵盖了从源代码到可执行文件的多个开发环节. 主要组件包括:

- `cl.exe`(编译器): 用于控制C和C++编译器和链接器的行为, 虽然它被称作是"编译器", 但是它也能调用链接器完成整个编译-链接过程
- `link.exe`(链接器): 可以独立运行, 直接处理`.obj`文件和库文件, 而不必通过`cl.exe`调用. 这种分离让链接器具备更大的灵活性, 便于处理不同的链接需求

使用`cl.exe`和`link.exe`的工作流程:

- 仅编译: `cl.exe /c filename.c`, 生成`.obj`文件而不链接
- 编译并链接: `cl.exe filename.c`, 自动帮你调用`link.exe`完成编译和链接, 生成可执行文件

除了编译器和链接器, 还提供了C/C++运行时库MSVCRT, 调试器(如`cdb.exe`), 代码分析工具等, 这些工具为开发过程中的调试, 性能分析提供了支持.

Windows SDK提供了Windows平台特有的库文件, 头文件和元数据, 是Windows应用开发的重要组成部分, 主要内容有:

- 头文件和库文件: Windows SDK提供了Windows API的头文件和库文件, 如`windows.h`, `user32.lib`, `kernel32.lib`等, 允许开发者调用Windows系统的底层功能, 如窗口管理, 文件I/O, 网络等
- 元数据和工具: Windows SDK包含UWP(通用Windows平台)和Win32应用程序的工具集. 适用于不同Windows版本的SDK会包含特定的API版本和平台支持, 例如最新的Windows11 SDK会提供一下Windows10没有的API.

::: tip
MSVC中包含的运行时库(MSVCRT)和Windows SDK库有显著区别:

- MSVC运行时库: 主要为C/C++应用程序提供标准库的功能, 如基本的输入输出, 内存管理, 数学运算, 错误处理等. 如`prinf`, `malloc`, `free`等函数的实现
- Windows SDK: 提供与Windows操作系统直接交互的API, 支持Windows特定的功能, 例如, Windows SDK包含文件操作, GUI, 设备管理, 网络通信, 线程控制等操作系统级别的API
:::

### GCC

在Linux平台上, GCC(GNU Compiler Collection)是最常用的编译工具链. 最早的GCC是"GNU C Compiler"的缩写, 专用于C语言. 随着发展, 它支持了多种编程语言, 因此改名为GNU Compiler Collection.

GCC包含多个子工具和库, 以支持从源代码到可执行文件的整个编译和构建流程:

- gcc-core: GCC的核心编译器, 用于执行代码的预处理, 编译, 最终将C/C++代码转换为汇编代码
- Binutils: 一组辅助工具, 包含:
    - ld: 链接器, 用于将多个目标文件和库文件合并为一个可执行文件
    - as: 汇编器, 用于将汇编代码转换为机器代码
    - readelf: 目标文件查看器, 用于查看二进制文件的详细信息
- glibc: GNU C库, 包含了C标准库的基本函数实现, 如`printf`, `malloc`等, 这些函数为C/C++程序提供了标准的输入输出, 内存管理等功能.

使用GCC编译的流程: `gcc hello.c -o hello`. 这段代码其实执行了两个步骤, 编译, 调用内部的`cc`编译器, 生成目标文件; 链接, 调用`ld`链接器, 将目标文件和标准库链接, 生成可执行文件. 可以使用`-c`参数让`gcc`只编译不链接, 也可以直接调用`cc`和`ld`来分别完成编译和链接操作.

#### Cygwin

Cygwin是一个在Windows上运行的POSIX兼容层, 为Windows系统提供类似于Linux环境的功能, 使开发者能够在Windows上运行和编写类Unix的程序. Cygwin默认内置GCC作为其主要编译器. 

它的特点有:

- POSIX兼容层: Cygwin的GCC编译器生成的程序会依赖Cygwin提供的POSIX兼容层, 即`cygwin1.dll`. 这使得程序可以在Windows上调用POSIX API, 从而使得很多Linux程序可以直接移植和运行在Windows上
- 生成非原生的Windows程序: 由于编译的程序依赖于`cygwin1.dll`, 所以他们不是原生的windows程序, 无法在没有Cygwin的windows环境中运行
- 工具链: Cygwin提供了`gcc`, `g++`等多种GCC编译器和工具链以及构建工具, 几乎和Linux上的GCC环境相同

#### MinGW

MinGW, Minimalist GNU for Windows, 是一个用于在Windows上构建Windows应用程序的编译工具集. 它基于GCC, 让开发者能够在Windows上使用GCC编译器来编译C, C++代码. MinGW提供了Windows版本的GNU开发工具, 支持生成原生Windows程序而无需依赖Cygwin这样的POSIX兼容层.

MinGW主要包含:

- GCC编译器: MinGW包含了适用于Windows的GCC编译器, 包括`gcc`, `g++`等命令
- Binutils工具集: 包含了链接器`ld`, 汇编器`as`, 目标文件分析工具`objdump`等
- MSVCRT(Microsoft Visual C++ Runtime Library): MinGW默认连接到Windows自带的MSVCRT库, 使得生成的程序能够运行在Windows平台上
- Windows API头文件和库文件: 与Windows SDK类似, 能够让开发者直接调用Windows系统提供的API
- MinGW Runtime: 一个简单的运行时库, 包含标准C库的实现. 注意, MinGW默认链接到MSVCRT, MinGW Runtime并不是一个完整的C运行时库, 而是一个针对MSVCRT的一个补充

优点:

- 轻量化: 和Cygwin相比, 不需要额外的POSIX兼容层, 生成的程序是纯Windows原生程序, 可以直接在Windows上运行
- 跨平台编译支持: 借助MinGW, 开发者可以在Linux上通过交叉编译生成Windows程序

#### MSYS2

MSYS2, Minimal SYStem 2, 是一个在Windows上运行的轻量级POSIX兼容环境, 基于Cygwin项目开发, 并集成了MinGW-w64和Archlinux的包管理工具pacman, 它提供了一个类似于Linux的命令行环境和工具链, 帮助开发者在Windows上更方便地进行跨平台开发, 编译和构建.

它的特点有:

- POSIX兼容层: MSYS2基于Cygwin的POSIX兼容层, 实现了基本的POSIX API, 使得许多Linux工具和程序可以直接在Windows上运行
- MinGW-w64: MSYS2集成了MinGW-w64工具链, 支持32位和64位Windows原生开发, 而不依赖POSIX兼容层

### Clang/LLVM

Clang和LLVM是一套现代的编译器工具链, 用于编译C, C++, Objective-C, Swift等多种编程语言. 它们系统工作, 提供从源代码到机器码生成的完整编译过程.

Clang是一个基于LLVM的的C, C++, 和Objective-C的编译器前端. Clang将源代码解析并生成LLVM的中间代码. LLVM(Low-Level Virtual Machine)提供了编译器后端, 优化器和代码生成器等多个模块. 

LLVM的主要组件有:

- LLVM Core: LLVM的核心库包含了对中间代码的处理功能. 包含了中间代码的转换和优化等. 中间代码是一种与硬件无关的代码, 便于跨平台的代码优化和转换
- 优化器: LLVM提供了多种优化技术, 如常量折叠, 死代码消除, 循环优化, 函数内联等, 通过这些优化技术, 可以大幅度提高生成代码的执行效率
- 后端代码优化器: LLVM包含了针对多种硬件平台(如x86, ARM, PowerPC等)的代码生成器, 它可以将中间代码转换为目标平台的汇编代码或机器码
- JIT: 即时编译器, LLVM提供了JIT支持, 可以在程序运行的时候即时生成和执行机器码, 这在解释型语言和动态优化中非常有用
- LLD: LLVM自带的链接器, 支持多种文件格式和平台, 允许将编译好的目标文件和库文件进行连接, 生成最终的可执行文件
- LLVM libc++和libc++abi: LLVM自己的C++标准库和异常处理库, 用于替代GNU的libstdc++, 支持更现代的C++标准和特性
- 分析工具: LLVM提供了各种代码分析工具, 如`llvm-profdata`(性能分析), `llvm-dov`(代码覆盖率分析)等

Clang的主要功能有:

- 词法分析和语法分析: Clang将源代码解析生抽象语法树, AST. 检查语法和语义错误
- 生成中间代码: Clang将AST转换为中间代码, 作为LLVM的输入
- 编译命令和选项: Clang提供了许多命令行选项, 兼容GCC的大部分参数

## 构建系统

构建系统是为了简化和自动化编译过程而诞生的, 特别是当项目逐渐复杂化的时候, 它提供了一种更高效的编译方式, 通过构建系统, 我们不再需要手动编写繁琐的编译指令, 而是将编译过程集中到一份构建配置文件中, 由构建系统根据文件自动生成所需要的指令, 并完整编译.

如果使用"炒菜"来比喻, 编译工具就是炒菜的工具, 而源代码, 库文件就是食材. 手动编写编译命令相当于自己按照步骤炒菜, 每一个步骤都要自己动手. 而构建系统就是自动化"炒菜机器人", 通过配置文件来指示每一步的操作, 使整个编译过程从繁琐的手动操作, 编程一键执行的自动化过程.

构建系统在底层依赖于编译工具链, 但是它抽象了项目的编译流程, 适应了不同的开发环境和需求, 支持复杂的编译配置(如debug模式和release模式). 常见的构建系统包括Makefile(主要在Linux中使用), CMake(跨平台构建工具), MSBuild(微软的构建工具等)

### MSBuild

在Windows开发环境中, MSBuild是主要的构建系统. MSBuild就好比是一位自动炒菜的机器人, 它可以根据图纸(配置文件)来自动操作. sln和vcxpro文件就是MSBuild的图纸. 这些文件记录了项目中需要的源代码文件, 依赖库的路径, 编译选项(如Debug或Release模式)等信息. MSVC就是这个过程中的"炒菜铲子", MSBuild不直接进行编译工作, 而是交给MSVC完成具体的编译和链接任务. 当你点击Visual Studio的运行或者构建按钮的时候, VS实际上调用的是msbuild.exe, 并按照sln和vcxproj文件中的配置来完成构建流程.

![](https://img.ricolxwz.io/22c4d93e619bd4000448d23a777693e5.png){style="display: block; margin: 0 auto; width: 90%;"}

### Make

在Linux/Unix上, Make是最主要的构建系统. 它的配置文件是Makefile, 相当于之前的sln和vcxproj文件. Makefile文件中包含了项目中的源代码文件, 编译选项, 依赖关系等信息, 并定义了每一步构建构成的详细规则, 当你输入命令`make`的时候, 系统会自动读取当前目录下的Makefile文件, 根据其中的配置生成GCC等编辑器的调用命令, 通过这些命令执行实际的编译.

![](https://img.ricolxwz.io/519c2d80d70ba577226c0eb1c20258ba.png){style="display: block; margin: 0 auto; width: 90%;"}

### xcodebuild

在macos上, xcodebuild是一个主要的构建系统, 它和msbuild的作用类似, 读取项目的配置文件.xcodeproj或者.xcworkspace, 然后根据配置来执行编译, 链接等操作.

![](https://img.ricolxwz.io/0e503c1c407270e7475145555df646d6.png){style="display: block; margin: 0 auto; width: 90%;"}

### Ninja

Ningja是一个跨平台的构建系统. 使用.ninja文件作为配置. 它在Windows, Linux, macOS上都可以使用. 它设计简单且优化了增量构建的流程, 使得重新编译修改过的文件非常高效, 特别适合大型项目的频繁构建需求.

![](https://img.ricolxwz.io/f465064438df50b5577eb591f5b2fa03.png){style="display: block; margin: 0 auto; width: 90%;"}

## 生成构建系统工具

### CMake

CMake是一种用于解决跨平台构建系统问题的工具. 在上节, 我们看到, 不同的操作系统都有各自的构建系统和配置格式, 例如Windows上使用MSBuild, 需要`.sln`和`.vcxproj`文件; Linux上使用Make, 需要`Makefile`文件, macOS上使用xcodebuild, 需要`.xcodeproj`文件. 每个系统构建系统的配置格式, 编译规则都不一样, 对于跨平台项目, 开发者需要在每个平台上编写并维护一套独立的构建配置文件, 这不仅增加了工作量, 也容易导致平台之间的构建配置不一致, 从而引发兼容问题.

为了简化跨平台构建, CMake提出了一种新的方法: 它本身不是一个直接用于构建的工具, 而是一个生成构建配置的工具, CMake使用通用的配置文件`CMakeLists.txt`, 这份文件是用一种特定的语言(DSL)编写的, 用于描述项目的结构, 依赖关系, 编译选项等.

![](https://img.ricolxwz.io/517aba3e21d1c4c8cd3fa4697be297db.png){style="display: block; margin: 0 auto; width: 90%;"}

### Xmake

Xmake是一个基于Lua语言的轻量级跨平台构建工具&生成构建工具, 它的独特之处在于可以扮演双重角色, 既可以作为构建系统直接执行编译, 又可以充当生成其他构建系统配置文件的工具. 

<br>

> [1] 面试高频问题之C++编译过程_c++_小万哥_InfoQ写作社区. (不详). 取读于 2024年11月11日, 从 https://xie.infoq.cn/article/ebda02316941c2141fcc5c4b5
>
> [2] C与CPP常见编译工具链与构建系统简介 - w4ngzhen - 博客园. (不详). 取读于 2024年11月11日, 从 https://www.cnblogs.com/w4ngzhen/p/17695080.html