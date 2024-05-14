import UIKit
import WebKit
import AVFoundation

class ViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler, UIScrollViewDelegate {
    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        do {
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Failed to set audio session category. \(error)")
        }
        // Configure the WKWebView to allow microphone access
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.allowsInlineMediaPlayback = true
        if #available(iOS 10.0, *) {
            webConfiguration.mediaTypesRequiringUserActionForPlayback = []
        } else {
            webConfiguration.requiresUserActionForMediaPlayback = false
        }

        let userScript = WKUserScript(source: """
            document.addEventListener('click', function(event) {
                var element = event.target;
                while (element && element.tagName !== 'A') {
                    element = element.parentNode;
                }
                if (element) {
                    window.webkit.messageHandlers.clickHandler.postMessage(null);
                }
            }, false);
            """, injectionTime: .atDocumentEnd, forMainFrameOnly: true)

        webConfiguration.userContentController.addUserScript(userScript)
        webConfiguration.userContentController.add(self, name: "clickHandler")

        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)

        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        let url = URL(string: "http://3.129.67.227:8000/create")!
        let request = URLRequest(url: url)
        webView.load(request)

        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.delegate = self
        webView.navigationDelegate = self
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "clickHandler" {
            triggerHapticFeedback()
        }
    }

    private func triggerHapticFeedback() {
        let generator = UIImpactFeedbackGenerator(style: .heavy)
        generator.prepare()
        generator.impactOccurred()
    }

    // UIScrollViewDelegate method to disable zooming
    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
        return nil
    }
}
