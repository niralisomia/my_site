---
layout: post
comments: true
title: The Basics of Mechanistic Interpretability
categories: [Concepts]
---

Hi! Welcome to my first blog post ever! Something I've found particularly interesting in AI recently is Mechanistic Interpretability. This was a concept many people in my postbacc lab were familiar with. We had a reading group on it and a hackathon exploring sparse autoencoders. I found it incredibly intriguing and knew I'd come back to it eventually. However, last year was the first time I was truly exposed to deep learning as a field. I was struggling to understand the intricacies of simple Convolutional Neural Networks, let alone grasp how to extract evidence that these models learn interpretable concepts.

Now, I'm in my second semester of my PhD program, and I took Deep Learning last semester (taught by Sara Beery, Kaiming He, and Omar Khattab). It was an amazing class (I highly recommend it to anyone at MIT who wants a better understanding of deep learning) and I finally feel ready to really dig into the complexities and mysteries of mechanistic interpretability. Before tackling the complicated stuff though, I needed to learn the nitty-gritty basics of this subfield. This blog post serves as a way to solidify my knowledge of the fundamentals and push myself to put these concepts into my own words and teach them to someone else (you!). So, if you're not future me (who I know will forget things and read this to re-remind herself), then welcome, and I hope this post can help at least a little!

Okay, now for the good stuff:

I recently read the review <a href="https://arxiv.org/abs/2501.16496"><u>“Open problems in Mechanistic Interpretability”</u></a> which was published in January of 2025. For the most part I will be summarizing and explaining what I learnt from this paper. A question I had straight off the bat when I first heard about this field: What actually is Mechanistic Interpretability?

Here’s how the review defines it: **Mechanistic interpretability aims to understand the computational mechanisms underlying neural networks’ capabilities in order to accomplish concrete scientific and engineering goals.** 

Okay so, what does *that* mean? This means we want to understand the actual operations and patterns happening under the hood and how these effect and lead to the tangible abilities that we observe. We want to know this for all sorts of practical reasons like understanding what causes harmful outputs, finding where and why models may fail, and building more trustworthy models.

This review identifies three different threads of interpretability research. The first aims at building AI systems that are inherently interpretable by design (i.e. linear models, concept bottleneck models, Kolmogorov-Arnold networks). The second is focused on the overall question “Why did my model make this particular decision?” This research thread led to a lot of local attribution methods (i.e. grad-CAM, integrated gradients, SHAP, LIME). “Local” methods are techniques that focus on explaining a model’s decision for a specific input. The third thread emerged as models got better at generalization. This thread is focused on the question of “How did my model solve this general class of problems?”. It focuses on the mechanisms underlying neural network generalization and was therefore deemed “mechanistic interpretability.” 