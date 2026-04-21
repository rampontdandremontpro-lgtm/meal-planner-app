package com.supdevinci.mealplanner.api

import android.content.Context
import android.util.Log
import androidx.datastore.preferences.core.stringPreferencesKey
import com.supdevinci.mealplanner.data.dataStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {

    private const val BASE_URL = "http://10.0.2.2:3000/"
    private lateinit var appContext: Context

    fun init(context: Context) {
        appContext = context.applicationContext
    }

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val authInterceptor = Interceptor { chain ->
        val originalRequest = chain.request()
        val path = originalRequest.url.encodedPath

        val requestBuilder = originalRequest.newBuilder()

        val isAuthRoute =
            path.contains("/auth/login") || path.contains("/auth/register")

        if (!isAuthRoute && ::appContext.isInitialized) {
            val tokenKey = stringPreferencesKey("jwt_token")
            val prefs = runBlocking { appContext.dataStore.data.first() }
            val token = prefs[tokenKey]

            if (!token.isNullOrBlank()) {
                requestBuilder.addHeader("Authorization", "Bearer $token")
            }
        }

        Log.d("RETROFIT_PATH", "Request path = $path | isAuthRoute = $isAuthRoute")

        chain.proceed(requestBuilder.build())
    }

    private val client: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .build()
    }

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val authApi: AuthApi by lazy {
        retrofit.create(AuthApi::class.java)
    }

    val recipesApi: RecipesApi by lazy {
        retrofit.create(RecipesApi::class.java)
    }

    val plannerApi: PlannerApi by lazy {
        retrofit.create(PlannerApi::class.java)
    }
}
