/*
 * @Author: mereith
 * @Date: 2022-04-27 19:46:05
 * @LastEditTime: 2024-12-19 10:00:00
 * @LastEditors: mereith
 * @Description: VanNav Chrome Extension Background Service Worker
 * @FilePath: \van-nav-chrome\background.js
 */

// 插件安装时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  console.log("VanNav extension installed:", details.reason);

  // 设置默认配置
  chrome.storage.sync.set(
    {
      color: "#3aa757",
      version: "2.0.0",
      lastUpdate: new Date().toISOString(),
    },
    () => {
      console.log("Default settings initialized");
    }
  );
});

// 处理插件图标点击事件
chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked on tab:", tab.id);
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);

  if (request.type === "GET_TAB_INFO") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({
          success: true,
          data: {
            url: tabs[0].url,
            title: tabs[0].title,
            favIconUrl: tabs[0].favIconUrl,
          },
        });
      } else {
        sendResponse({ success: false, error: "No active tab found" });
      }
    });
    return true; // 保持消息通道开放
  }

  if (request.type === "OPEN_TAB") {
    chrome.tabs.create({ url: request.url }, (tab) => {
      sendResponse({ success: true, tabId: tab.id });
    });
    return true;
  }
});

// 错误处理
chrome.runtime.onSuspend.addListener(() => {
  console.log("Extension is being suspended");
});

// 存储变化监听
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log("Storage changed:", changes, "in namespace:", namespace);
});
