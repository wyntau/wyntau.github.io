---
title: 解决-数据结构八皇后问题
pid: 113
tags: [C, 原创, 数据结构]
---
今天一天都没怎么上网,一直都在鼓捣数据结构问题.原来我就在一篇文章中写过 [初识八皇后问题](/2011/03/10-eight-queens-problem.html) 可惜当时什么都不会.只是写了写这个问题的要求是什么.
今天终于把这个问题给解决了.
还是再说说这个问题吧.

[百度百科](http://baike.baidu.com/view/698719.htm)中的解释:

八皇后问题，是一个古老而著名的问题，是回溯算法的典型例题。该问题是十九世纪著名的数学家高斯1850年提出：在8X8格的国际象棋上摆放八个皇后，使其不能互相攻击，即任意两个皇后都不能处于同一行、同一列或同一斜线上，问有多少种摆法。 高斯认为有76种方案。1854年在柏林的象棋杂志上不同的作者发表了40种不同的解，后来有人用图论的方法解出92种结果。计算机发明后，有多种方法可以解决此问题。

[维基百科](http://zh.wikipedia.org/wiki/八皇后问题)中的解释:

八皇后问题是一个以国际象棋为背景的问题：如何能够在 8×8 的国际象棋棋盘上放置八个皇后，使得任何一个皇后都无法直接吃掉其他的皇后？为了达到此目的，任两个皇后都不能处于同一条横行、纵行或斜线上。八皇后问题可以推广为更一般的n皇后摆放问题：这时棋盘的大小变为n×n，而皇后个数也变成n。当且仅当 n = 1 或 n ≥ 4 时问题有解。

*基本要求*就是这样:同行,同列,同对角线不能有棋子就OK了.
我的数据结构课本上给的提示是用递归的方法做.所以我就把我的代码写一下.顺便做下注释.如果大家有更好的解法,可以给我说哦.
我发现我的代码量有点多,由于我不太懂那些用一维数组的方法,所以我的方法显得有点笨,但是好歹可以做出来.

	/*****************************
	Program:八皇后问题
	Author:lwent90
	Date:2011-5-4
	*****************************/
	#include<stdio.h>
	int queen[8][8];    //定义一个二维数组,存放棋盘
	int m=1;    //定义解法个数
	int check(int i,int j)
	//检查函数,结果用k返回,如果k=0,则所有的检查位置都符合条件,可以放棋子
	{   int k=0;int a,b;
	    for(a=0;a<i;a++)//检查同列是否有棋子
	        if(queen[a][j]==1)
	        k++;
	    for(a=i-1,b=j-1;a>=0&&b>=0;a--,b--)//检查左对角线元素
	        if(queen[a][b]==1)
	        k++;
	    for(a=i-1,b=j+1;a>=0&&b<8;a--,b++)//检查右对角线元素
	        if(queen[a][b]==1)
	        k++;
	    return k;
	}
	void put(int i)  //递归函数,放棋子
	{   int j;
	    if(i>=8)   //当i大于等于8时,输出已经放好的棋子,i从0开始
	    {
	        printf("第%d种解法:\n",m++);
	        for(i=0;i<8;i++)
	            {
	                for(j=0;j<8;j++)
	                    if (queen[i][j]==1 )
	                        printf("%d ",j);
	                    else printf("- ");
	                printf("\n");
	            }
	        printf("\n");

	    }
	    else        //递归放棋子
	        for(j=0;j<8;j++)
	        {   queen[i][j]=1;
	            if(check(i,j)==0)
	                put(i+1);
	            queen[i][j]=0;
	        }
	}
	int main()  //主函数
	{put(0);
	return 0;
	}
输出格式为:
"第X种解法:
棋盘布局;"
