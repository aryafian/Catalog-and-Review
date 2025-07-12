"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Heart, Star, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "@/hooks/use-wishlist"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

interface ReviewForm {
  name: string
  email: string
  rating: string
  comment: string
}

interface FormErrors {
  name?: string
  email?: string
  rating?: string
  comment?: string
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    name: "",
    email: "",
    rating: "",
    comment: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const productId = params?.id
    console.log("Product ID from params:", productId) // Debug log

    if (productId) {
      const id = Array.isArray(productId) ? productId[0] : productId
      fetchProduct(id)
    } else {
      setError("Product ID not found")
      setLoading(false)
    }
  }, [params?.id])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching product with ID:", id) // Debug log

      // Add timeout untuk deployment
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Product data received:", data) // Debug log

      if (!data || !data.id) {
        throw new Error("Invalid product data received")
      }

      setProduct(data)
    } catch (error) {
      console.error("Error fetching product:", error)
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setError("Request timeout. Please try again.")
        } else {
          setError(`Failed to load product: ${error.message}`)
        }
      } else {
        setError("Failed to load product. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!reviewForm.name.trim()) {
      errors.name = "Name is required"
    }

    if (!reviewForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewForm.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!reviewForm.rating) {
      errors.rating = "Rating is required"
    }

    if (!reviewForm.comment.trim()) {
      errors.comment = "Comment is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof ReviewForm, value: string) => {
    setReviewForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form and show success
      setReviewForm({ name: "", email: "", rating: "", comment: "" })
      setSubmitSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWishlistToggle = () => {
    if (!product) return

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleRetry = () => {
    const productId = params?.id
    if (productId) {
      const id = Array.isArray(productId) ? productId[0] : productId
      fetchProduct(id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading product details...</span>
          <span className="text-sm text-gray-500">Product ID: {params?.id}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRetry}>Try Again</Button>
            <Link href="/">
              <Button variant="outline">Back to Catalog</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Catalog
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="aspect-square relative bg-white rounded-lg overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-contain p-8"
              unoptimized={true}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating.rate) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>
              <p className="text-4xl font-bold text-green-600 mb-6">${product.price.toFixed(2)}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleWishlistToggle}
                variant={isInWishlist(product.id) ? "default" : "outline"}
                className="flex-1"
              >
                <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Review Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            {submitSuccess && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thank you! Your review has been submitted successfully.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={formErrors.name ? "border-red-500" : ""}
                    placeholder="Your full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={reviewForm.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={formErrors.email ? "border-red-500" : ""}
                    placeholder="your.email@example.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="rating">Rating *</Label>
                <Select value={reviewForm.rating} onValueChange={(value) => handleInputChange("rating", value)}>
                  <SelectTrigger className={formErrors.rating ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars - Excellent</SelectItem>
                    <SelectItem value="4">4 Stars - Very Good</SelectItem>
                    <SelectItem value="3">3 Stars - Good</SelectItem>
                    <SelectItem value="2">2 Stars - Fair</SelectItem>
                    <SelectItem value="1">1 Star - Poor</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.rating && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.rating}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="comment">Comment *</Label>
                <Textarea
                  id="comment"
                  value={reviewForm.comment}
                  onChange={(e) => handleInputChange("comment", e.target.value)}
                  className={formErrors.comment ? "border-red-500" : ""}
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                />
                {formErrors.comment && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.comment}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting Review...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
