import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, IceCreamBowlIcon as Bowl, FileIcon as FileList, Scale, Compass } from "lucide-react"

interface ProductDetailsProps {
  product: any
}

export function ProductDetails({ product }: ProductDetailsProps) {
  // Helper function to determine color based on value
  const getColorClass = (value: number, thresholds: { green: number; orange: number }) => {
    if (value <= thresholds.green) return "level-low"
    if (value <= thresholds.orange) return "level-medium"
    return "level-high"
  }

  // Extract nutritional values
  const sugar = product.nutriments?.sugars || 0
  const transFats = product.nutriments?.["trans-fat"] || 0
  const sodium = product.nutriments?.sodium || 0
  const calories = product.nutriments?.energy_kcal_100g || product.nutriments?.energy_kcal || "N/A"

  // Determine color classes
  const sugarColor = getColorClass(sugar, { green: 5, orange: 10 })
  const transFatColor = getColorClass(transFats, { green: 0.5, orange: 1 })
  const sodiumColor = getColorClass(sodium, { green: 0.2, orange: 0.4 })

  // Determine nutri-score class
  const nutriScore = product.nutriscore_grade ? product.nutriscore_grade.toUpperCase() : "Unknown"
  const nutriScoreClass =
    nutriScore === "A"
      ? "score-a"
      : nutriScore === "B"
        ? "score-b"
        : nutriScore === "C"
          ? "score-c"
          : nutriScore === "D"
            ? "score-d"
            : nutriScore === "E"
              ? "score-e"
              : "score-unknown"

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="font-lilita text-2xl md:text-3xl text-center mb-8">Product Details</h2>

        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl md:text-2xl">{product.product_name || "Unknown Product"}</CardTitle>
            {product.brands && <p className="text-muted-foreground">{product.brands}</p>}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Health Ratings
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Sugar</span>
                      <span className={`info-box ${sugarColor}`}>{sugar} g</span>
                    </div>
                    <Progress value={(sugar / 20) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Trans Fats</span>
                      <span className={`info-box ${transFatColor}`}>{transFats} g</span>
                    </div>
                    <Progress value={(transFats / 2) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Sodium</span>
                      <span className={`info-box ${sodiumColor}`}>{sodium} g</span>
                    </div>
                    <Progress value={(sodium / 0.6) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Bowl className="h-5 w-5" /> Nutri-Score
                </h3>
                <div className="flex justify-center py-4">
                  <div className={`nutri-score ${nutriScoreClass} text-3xl w-16 h-16 flex items-center justify-center`}>
                    {nutriScore}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2">
                  <Compass className="h-5 w-5" /> Calories
                </h3>
                <p className="text-xl font-bold">
                  {calories} kcal <span className="text-sm font-normal text-muted-foreground">(per 100g)</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="analysis">Ingredients Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileList className="h-5 w-5" /> Ingredients List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">
                  {product.ingredients_text || "No ingredients information available"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Scale className="h-5 w-5" /> Ingredients Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium">Potential Concerns:</h4>
                  {product.additives_tags && product.additives_tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {product.additives_tags.map((additive: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-red-100 dark:bg-red-900/20">
                          {additive.replace("en:", "").toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p>No additives detected</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
