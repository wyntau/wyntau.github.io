---
layout: post
title: 数据结构习题一则
pid: 84
comments: true
tags: [C, 原创, 数据结构]
categories: [学习笔记]
---
最近几天一直在为 一段程序上火.上周四下午的数据结构实验课,题目是 **使用链表求两个多项式的乘法**.

会的人听起来还是挺简单的吧.呵呵.就是嘛.会了不难,难了不会.俺上课的时候好像从来没有认真听过,所以这个对我来说就是有点难啦.连新建一个链表都不会的人,更别说使用链表求多项式乘法啦. 再加上C语言中最有意思的指针,当时就头大啦.没办法,临时从网上找了一段答案,先对付过去再说.

到了机房里面,也没有老师.自己做.这下就更不想做啦.毕竟不是自己写的程序,看不懂啊.还是先看看人家的思想吧.然后再自己憋出来一个也算是那么回事嘛.

今天来劲了,一直在鼓捣这个,确实学习到了不少东西啊.就像玩网页一样啊,弄的多了自然就懂了.看来以后要多多实践,多多练习.

先**分析**一下题目要求,要求输入两个多项式.然后输出两个多项式以及两个多项式相乘后的结果. 要求使用动态链表的方法求解. 基本算法也很简单.无非就是 输入两个多项式,然后进行一下排序,合并同类项之类的.然后相乘,再将结果进行一下合并同类项即可.看似不难,实则不然.

动态链表,我感觉挺难的地方就是指针的使用加上相应的判断条件,还有安全性检查等等.相乘的地方应该有很多可以挖掘的地方,但是对于我这样的算是自学的人来说只能使用最简单最笨的方法啦.就是使用两重循环逐次相乘即可. 大体的要点即是如此.

总结一下遇到的问题.首先是输入多项式问题.怎么做到将乱序输入的函数排序再加上合并同类项.然后就是阻挠了我最长时间的**多项式相乘**的问题. 两重循环的跳出判断条件加错了,导致程序根本无法运行,总是出现内存错误.可是在编译的时候却检测不出来,这可是害苦我了. 编译错误可比运行错误还改多了啊.

唉不说了. 直接上程序吧. 也算是学完C和C++以来的第一个程序吧.说来意义还是挺大的,所以记录一下,虽然程序很简单....而且还从网上借鉴了一点思想.

额 还想说说这个程序我认为的好处,输入多项式的同时进行排序还有合并同类项,感觉少写了很多代码,而且复用性比较高吧,多项式乘法中的排学我用了同样的方法.然后就是这个排序合并同类项时候用到的方法,很新颖(对我来说).还有就是 循环的跳出条件 对我来说太具有新意啦,搞的我刚上来怎么都弄不出来.

最后还想说一句,学完 谭浩强 的书,我真的没学会什么东西......
还想借[ethan](http://blog.ethansite.co.cc/vim-for-programmer)童鞋的一句话,**程序员苦逼啊！** :jiong:

	/**************************************************************
	多项式相乘算法,
	Date:4-16
	Author: lwent90
	***************************************************************/
	#include <stdio.h>
	#include <malloc.h>

	//多项式中的一项的结构
	typedef struct term
		{
			int coef,exp;
			struct term* next;
		}poly,*ppoly;

	//创建一个保存多项式的链表，返回指向头结点的指针。多项式按指数降序排列
	ppoly createpoly(int i)
		{
			poly *p,*q,*s,*head=NULL; //p做当前指针,q做下一个指针,s做输入指针,head固定链表的头指针.
			int coef,exp;
			head=(ppoly)malloc( sizeof(poly) );
			if (head==NULL)
				{ 	printf("failed!!n");
					return NULL;
				}
			head->coef=0;
			head->exp=0;
			head->next=NULL;
			if(i==1)
			printf ("请输入A的系数和指数(输入"0 0"结束):n");
			else printf ("请输入B的系数和指数(输入"0 0"结束):n");
			scanf ("%d%d",&coef,&exp);//初次赋值

			while (coef !=0 && exp >= 0) //循环输入系数和指数,合并同类项,并按照指数降序排列
				{	s = (ppoly)malloc (sizeof (poly) );
					s -> coef = coef;
					s -> exp = exp;
					p = head ;
					q = head -> next; //每次输入一个系数和指数.p当前结点.q指向下一个结点
					while ( q && exp < q -> exp )
						{ 	p = q;
				  			q = q -> next;
						}
					if ( q == NULL || exp > q -> exp)
						{ 	p ->next = s;
				  			s -> next = q;
						}
					else { q -> coef += coef;}
					printf("请输入系数和指数:n");
	  				scanf("%d%d",&coef,&exp);
				}
			return head;
		 }
	ppoly multiply (ppoly A, ppoly B)  //多项式相乘函数,返回结果的头指针
		{	poly *pa, *pb, *pp, *pq, *s,*head;
			head = (ppoly)malloc (sizeof (poly));
			head->coef=0;
			head->exp=0;
			head->next=NULL;
	       //以上三步必须加,要不然在windows里面无法运行.因为head->next是未知的,需要变成NULL
			for(pa=A->next ;pa!=NULL;pa=pa->next)
				for (pb=B->next ; pb!=NULL;pb=pb->next)  //两重循环,判断条件为 此结点是否为空
					{
						s=(ppoly)malloc(sizeof (poly));
						s->coef = (pa->coef)*(pb->coef);
						s ->exp = (pa ->exp)+(pb->exp);
						pp=head;pq=head->next;
						while(pq && (s->exp)<(pq->exp))        //同输入函数,输入的过程中 进行排序以及合并同类项
							{pp=pq;pq=pq->next;}
						if (pq == NULL || (s->exp)>(pq->exp))
							{pp->next = s;s ->next = pq;}
						else pq->coef += s->coef;
					}
			return head;
		}
	void Printpoly(ppoly head) //打印函数
		{
	 		poly *p=head->next;
	 		while(p)
	 			{
	  				printf("%d",p->coef);
	  				if(p->exp )
	   					printf("*x^%d",p->exp );
	  				if(p->next && p->next->coef >0)
	   					printf("+");
	  				p=p->next;
	 			}
		}
	int main()
		{	ppoly A,B,C;
			printf("***************************************************");
			printf("nttPrograme:多项式相乘ntt");
			printf("Date:4-16ttnttAuthor: lwent90n");
			printf("***************************************************n");
			A=createpoly(1);
			printf("A(x)=");
	 		Printpoly (A);
	 		printf("n");
	 		B=createpoly(2);
	 		printf("B(x)=");
	 		Printpoly (B);
	 		printf("n");
	 		C=multiply(A,B);
	 		printf("C(x)=");
	 		Printpoly (C);
	 		printf("n");
	 		return 0;
	 	}
