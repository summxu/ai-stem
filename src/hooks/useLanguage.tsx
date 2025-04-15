import { createContext, useContext, useState, useEffect } from 'react';
import { tify, sify } from 'chinese-conv';

type LanguageType = 'simplified' | 'traditional';

interface LanguageContextType {
    langType: LanguageType;
    toggleLanguage: (type: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [langType, setLangType] = useState<LanguageType>('traditional'); // 默认简体中文

    // 处理文本节点的函数
    const processTextNodes = (element: Node, convertFunc: (text: string) => string) => {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue && node.nodeValue.trim()) {
                node.nodeValue = convertFunc(node.nodeValue);
            }
        }
    };

    // 转换当前页面内容的函数
    const convertCurrentPageContent = (convertFunc: (text: string) => string) => {
        // 使用requestIdleCallback优化性能，在浏览器空闲时执行
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
                processTextNodes(document.body, convertFunc);
            });
        } else {
            // 降级处理
            setTimeout(() => {
                processTextNodes(document.body, convertFunc);
            }, 0);
        }
    };

    // 切换简繁体中文
    const toggleLanguage = (type: LanguageType) => {
        if (type === langType) return;
        setLangType(type);

        // 保存用户语言偏好到localStorage
        localStorage.setItem('langType', type);

        if (type === 'traditional') {
            // 立即转换当前页面内容为繁体中文
            convertCurrentPageContent(tify);
        } else {
            // 立即转换当前页面内容为简体中文
            convertCurrentPageContent(sify);
        }
    };

    // 初始化时检查用户语言偏好
    useEffect(() => {
        const savedLangType = localStorage.getItem('langType') as LanguageType | null;
        if (savedLangType && savedLangType !== langType) {
            toggleLanguage(savedLangType);
        }

        // 设置MutationObserver监听DOM变化，动态转换新增内容
        const observer = new MutationObserver((mutations) => {
            if (langType === 'traditional') {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) { // 元素节点
                                processTextNodes(node, tify);
                            }
                        });
                    }
                });
            } else if (langType === 'simplified') {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) { // 元素节点
                                processTextNodes(node, sify);
                            }
                        });
                    }
                });
            }
        });

        // 开始观察整个文档
        observer.observe(document.body, { childList: true, subtree: true });

        // 组件卸载时停止观察
        return () => observer.disconnect();
    }, [langType]);

    return (
        <LanguageContext.Provider value={{ langType, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};