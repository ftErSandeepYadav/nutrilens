"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade } from "swiper/modules"
import { Html5QrcodeScanner } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductDetails } from "@/components/product-details"

// Import Swiper styles
import "swiper/css"
import "swiper/css/effect-fade"

export default function Home() {
  const [barcode, setBarcode] = useState("")
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [scannerActive, setScannerActive] = useState(false)
  const scannerRef = useRef<any>(null)
  const scannerDivRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    // Clean up scanner on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [])

  const startScanner = () => {
    if (scannerActive) return

    setScannerActive(true)

    setTimeout(() => {
      if (!scannerDivRef.current) return

      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: { width: 250, height: 250 },
          fps: 20,
        },
        false,
      )

      scanner.render(
        (decodedText: string) => {
          setBarcode(decodedText)
          scanner.clear()
          setScannerActive(false)
          searchProduct(decodedText)
        },
        (error: any) => {
          console.error(error)
        },
      )

      scannerRef.current = scanner
    }, 100)
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
      scannerRef.current = null
    }
    setScannerActive(false)
  }

  const searchProduct = async (code: string = barcode) => {
    if (!code) {
      setError("Please enter a barcode")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`)
      const data = await response.json()

      if (!data.product) {
        setError("Product not found. Please try another barcode.")
        setProduct(null)
      } else {
        setProduct(data.product)
      }
    } catch (err) {
      setError("Error fetching product details. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 px-4 text-center">
          <div className="container mx-auto max-w-5xl">
            <h1 className="font-lilita text-4xl md:text-5xl lg:text-6xl mb-4 text-primary">Welcome to NutriLens!</h1>
            <p className="font-barriecito text-xl md:text-2xl mb-8 text-muted-foreground">
              Discover food insights with a simple scan
            </p>

            <div className="max-w-3xl mx-auto mb-12">
              <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                loop={true}
                className="rounded-xl shadow-lg"
              >
                <SwiperSlide>
                  <img
                    src="/bd.jpg?height=400&width=800"
                    alt="Healthy food choices"
                    className="w-full h-[300px] md:h-[400px] object-contain"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/healthy.jpg?height=400&width=800"
                    alt="Nutrition information"
                    className="w-full h-[300px] md:h-[400px] object-contain"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/choice.jpg?height=400&width=800"
                    alt="Healthy eating habits"
                    className="w-full h-[300px] md:h-[400px] object-contain"
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </section>

        {/* Scanner & Search Section */}
        <section className="py-8 px-4 bg-secondary/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-lilita text-2xl md:text-3xl text-center mb-8">Scan or Search for Products</h2>

            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="search">Manual Search</TabsTrigger>
                <TabsTrigger value="scan">Barcode Scanner</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter barcode number..."
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={() => searchProduct()} disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scan">
                <Card>
                  <CardContent className="pt-6">
                    {!scannerActive ? (
                      <Button onClick={startScanner} className="w-full">
                        Start Scanner
                      </Button>
                    ) : (
                      <Button onClick={stopScanner} variant="outline" className="w-full mb-4">
                        Stop Scanner
                      </Button>
                    )}

                    <div ref={scannerDivRef} id="reader" className={`mt-4 ${scannerActive ? "block" : "hidden"}`}></div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </section>

        {/* Product Details Section */}
        {product && <ProductDetails product={product} />}

        {/* Nutrition Information Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-permanent text-2xl md:text-3xl mb-6">Additional Information</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sugar">
                <AccordionTrigger className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Added Sugar Level Warning
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 border-l-4 border-red-500 p-4 mt-2 rounded-r-md">
                  Consuming excessive amounts of added sugar can lead to various health problems, including weight gain,
                  increased risk of type 2 diabetes, heart disease, and damage to organs and blood vessels over time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="transfat" className="mt-4">
                <AccordionTrigger className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Trans Fat Level Warning
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 border-l-4 border-red-500 p-4 mt-2 rounded-r-md">
                  Trans fats are a type of unsaturated fat, some occurring naturally and others created artificially
                  through hydrogenation, and are generally considered unhealthy due to their impact on cholesterol
                  levels and heart health. Excessive consumption of trans fats has been linked to various health
                  problems, including heart disease, stroke, and type 2 diabetes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sodium" className="mt-4">
                <AccordionTrigger className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Sodium Level Warning
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 border-l-4 border-red-500 p-4 mt-2 rounded-r-md">
                  Excessive sodium intake can lead to high blood pressure, increasing the risk of heart disease, stroke,
                  kidney problems, and bone loss, as well as contributing to fluid retention.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="additives" className="mt-4">
                <AccordionTrigger className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Additives Warning
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 border-l-4 border-red-500 p-4 mt-2 rounded-r-md">
                  <p className="font-bold">Artificial Sweeteners:</p>
                  <p>
                    Aspartame: Some studies suggest potential links to neurological and behavioral issues, though more
                    research is needed.
                  </p>
                  <p>
                    Acesulfame K: Similar to aspartame, some studies suggest potential neurological and behavioral
                    issues.
                  </p>
                  <p>
                    Sucralose: While generally considered safe, some studies suggest potential impacts on gut
                    microbiota.
                  </p>
                  <p>Sorbitol: Can cause digestive issues like diarrhea and gas in some individuals.</p>

                  <p className="font-bold mt-4">Artificial Colors:</p>
                  <p>
                    Red 40, Yellow 5, Yellow 6: Can cause allergic reactions and may promote hyperactivity in sensitive
                    children.
                  </p>
                  <p>Red 3: Linked to increased risk of thyroid tumors in animal studies.</p>

                  <p className="font-bold mt-4">Preservatives:</p>
                  <p>
                    Nitrites and Nitrates: Found in processed meats, linked to an increased risk of colorectal cancer.
                  </p>
                  <p>BHA (Butylated Hydroxyanisole): Some studies suggest potential cancer risks.</p>
                  <p>
                    Sulphites: Can trigger allergic reactions, especially in people who are asthmatic or have other
                    allergies.
                  </p>

                  <p className="font-bold mt-4">Other Additives:</p>
                  <p>MSG (Monosodium Glutamate): Can trigger allergic reactions and may cause digestive issues.</p>
                  <p>
                    Bisphenol A (BPA): Found in food packaging, linked to increased risk of cancer and endocrine
                    disruption.
                  </p>
                  <p>
                    Phthalates: Found in plastic packaging, can interfere with hormone function and may increase the
                    risk of obesity and cardiovascular disease.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
